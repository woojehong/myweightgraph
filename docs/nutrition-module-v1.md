# 마웨그 식단 모듈 V1

## 범위

- 한국 성인 남성 3명의 체지방 감량·근육량 증가 보조 기록기
- 기존 초·노·빨 식단, 포인트, 업적, 그래프와 분리
- 활동일 경계는 오전 6시
- OpenAI 및 InBody 유료 API 미사용

## 데이터

- `nutritionProfiles/{uid}`: 활동량, 현재 목표, 마지막 제안
- `nutritionEntries/{uid}/entries/{id}`: 음식 단위 섭취 기록
- `nutritionPresets/{uid}/items/{id}`: 단일 음식·한 끼·레시피
- `nutritionFoods/{id}`: 친구 3명이 공유하는 음식
- `inbodyRecords/{uid}/records/{date}`: 월간 InBody 수동 기록
- `nutritionTrash/{uid}/entries/{id}`: 삭제 기록, 슈퍼관리자 전용
- `workoutSessions/{uid}/sessions/{id}`: 후속 운동 기록용 예약 구조

## 출처 표시

- `manual`: 사용자 직접 입력
- `database`: 로컬/공식 음식 DB 계산
- `estimate`: 사진·문장 추정용 예약값
- `user_confirmed`: 사용자가 추정치를 수정·확정한 값

## 목표 제안

- 남성 Mifflin–St Jeor 휴식대사량
- 활동계수 1.3 / 1.5 / 1.7
- 초기 재구성 목표: 유지열량의 90%
- 단백질 1.8g/kg
- 지방은 0.8g/kg 및 총열량 22% 중 큰 값
- 나머지를 탄수화물로 배분
- 제안은 자동 적용하지 않고 사용자가 승인해야 저장

## 후속

- 식약처 K-FIND API 키 발급 후 검색 어댑터 연결
- 결과지 OCR은 브라우저 로컬 처리 검증 후 추가
- AI 제공자는 별도 서버 어댑터로만 연결하며 기본 비활성

