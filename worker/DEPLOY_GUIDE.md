# 걸음 수 자동 동기화 Worker 배포 가이드 (mwg-steps-sync)

이미 다른 프로젝트에서 Cloudflare Workers + wrangler를 쓰고 있다는 전제로,
필요한 단계만 빠르게 정리했습니다.

전체 흐름:

> 아이폰 단축어 → 이 Worker(`/steps`) → 서비스 계정으로 Firestore(`weights/{uid}/records/{날짜}`)에 걸음 수만 merge 저장

---

## 1. GCP에서 서비스 계정 만들기 (키 JSON 발급)

Firebase 프로젝트 = GCP 프로젝트 `mygraph-6e4c8` 입니다.

1. https://console.cloud.google.com 접속 → 상단 프로젝트 선택에서 **mygraph-6e4c8** 선택
2. 왼쪽 메뉴 **IAM 및 관리자 → 서비스 계정** → 상단 **+ 서비스 계정 만들기**
3. 이름: `mwg-steps-sync` (아무거나 OK) → **만들기 및 계속**
4. 역할 선택: **Cloud Datastore 사용자** (`roles/datastore.user`)
   - Firestore 문서 읽기/쓰기에 딱 필요한 만큼만 주는 역할입니다. Editor/Owner는 주지 마세요.
5. **완료** → 방금 만든 서비스 계정 클릭 → **키** 탭 → **키 추가 → 새 키 만들기 → JSON → 만들기**
6. JSON 키 파일이 다운로드됩니다. **이 파일은 비밀번호와 같습니다.** git에 절대 커밋 금지, 사용 후 안전한 곳에 보관하거나 삭제.

다운로드된 JSON에서 쓸 필드는 딱 2개입니다:

```json
{
  "client_email": "mwg-steps-sync@mygraph-6e4c8.iam.gserviceaccount.com",  ← SA_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"  ← SA_PRIVATE_KEY
}
```

## 2. Worker 시크릿 등록

`worker/` 디렉터리에서:

```bash
cd worker

# 1) client_email 값 (따옴표 없이 이메일만)
wrangler secret put SA_CLIENT_EMAIL
# 프롬프트에 붙여넣기: mwg-steps-sync@mygraph-6e4c8.iam.gserviceaccount.com

# 2) private_key 값 (-----BEGIN PRIVATE KEY----- 부터 -----END PRIVATE KEY----- 까지 전체)
wrangler secret put SA_PRIVATE_KEY
```

`SA_PRIVATE_KEY`는 JSON의 `private_key` **값 전체**를 붙여넣으면 됩니다.
JSON 그대로 복사해서 `\n`이 문자 그대로 들어가도 Worker 코드가 알아서 개행으로 바꿔주니 걱정하지 않아도 됩니다.
(앞뒤 큰따옴표 `"`는 빼고 붙여넣으세요.)

## 3. 배포

```bash
wrangler deploy
```

배포가 끝나면 URL이 출력됩니다. 예:

```
https://mwg-steps-sync.<내-서브도메인>.workers.dev
```

## 4. guide.html에 Worker URL 반영

`guide.html` 상단 스크립트의 상수를 실제 배포 URL로 교체:

```js
const WORKER_URL = 'https://mwg-steps-sync.<내-서브도메인>.workers.dev';
```

수정 후 GitHub Pages에 다시 배포(push)하면 끝.

## 5. curl 테스트

토큰은 guide.html에서 "연동 코드 발급하기"를 누르면 생성됩니다 (users/{uid} 문서의 `syncToken` 필드).

**① GET 단건 (오늘 날짜, 서울 기준 자동):**

```bash
curl "https://mwg-steps-sync.<내-서브도메인>.workers.dev/steps?token=<발급된토큰>&steps=1234"
```

**② POST 배치 (여러 날짜 한 번에):**

```bash
curl -X POST "https://mwg-steps-sync.<내-서브도메인>.workers.dev/steps" \
  -H "Content-Type: application/json" \
  -d '{"token":"<발급된토큰>","days":[{"date":"2026-07-15","steps":8432},{"date":"2026-07-16","steps":10021}]}'
```

성공 응답: `{"ok":true,"saved":[{"date":"...","steps":...}]}`

살아있는지 확인: `curl https://.../health` → `ok`

## 6. 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `403 invalid token` | 토큰 오타이거나 아직 발급 전. guide.html에서 발급된 토큰을 그대로 복사했는지 확인. 발급 직후라면 OK지만, 토큰을 재발급한 경우 Worker가 옛 토큰을 최대 10분 캐시하므로 잠시 기다리기. |
| `500 internal error` + wrangler tail에 `oauth token exchange failed (401)` | 서비스 계정 시크릿 문제. `SA_CLIENT_EMAIL`이 JSON의 `client_email`과 정확히 일치하는지, `SA_PRIVATE_KEY`에 BEGIN/END 줄까지 전부 들어갔는지 확인 후 `wrangler secret put`으로 다시 등록 → `wrangler deploy`. |
| `500` + tail에 `firestore patch failed (403)` | 서비스 계정 역할 누락. GCP IAM에서 해당 계정에 **Cloud Datastore 사용자** 역할이 있는지 확인. |
| `400 date must be ...` | 날짜가 미래이거나 14일보다 오래됨. Worker는 **한국 시간(Asia/Seoul)** 기준으로 판단합니다. 자정 직후(00:00~00:59)에 단축어가 "어제" 걸음을 보내면 date 파라미터 없이 보낼 경우 "오늘" 날짜로 저장되니, 자동화 실행 시각은 23:45처럼 자정 전으로 잡는 걸 권장. |
| 걸음 수가 그래프에 안 보임 | Firestore 콘솔에서 `weights/{uid}/records/{날짜}` 문서에 `steps` 필드가 생겼는지 먼저 확인. 문서가 생겼다면 Worker는 정상이고 앱 쪽 표시 문제. |

로그 실시간 확인: `wrangler tail mwg-steps-sync`
(로그에는 토큰·키가 찍히지 않도록 코드에서 막아두었습니다.)
