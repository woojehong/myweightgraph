# 마웨그 쇼룸 V5 수집품 로스터 제안

## 0. 문서 성격과 적용 범위

- 목적: 그래프 스킨·카드 테마 완료 후 제작할 **동반자 40종, 프로필 이모티콘 40종, 이모티콘 테두리 40종**의 실행 가능한 원화 로스터.
- 범위: 고급·희귀·영웅·전설 각 10종, 총 120종. 기본 아이템은 별도이며 이 표의 120종에 포함하지 않는다.
- private-use override: 대표님과 지정된 친구만 사용하는 비공개·비상업·비배포 환경을 전제로 한다. 실제 IP 고유명 대신 마웨그식 전시명을 사용하되, 희귀 이상 동반자는 대표님이 지정한 유명 게임·영화·스포츠 원형을 분명히 연상하도록 설계한다.
- 공개 배포로 전환될 경우 IP·상표·구단 로고·캐릭터 유사성을 전면 재검토해야 한다.
- 금지: 같은 도안을 색만 바꿔 재사용, 원형 배지 안에 캐릭터 얼굴만 교체, 테두리에 네온 색상만 변경, 등급을 발광량만으로 구분.

## 1. 공통 제작 규격

| 구분 | 고급 | 희귀 | 영웅 | 전설 |
|---|---|---|---|---|
| 실루엣 | 한눈에 읽히는 단일 덩어리 | 도구·날개·뿔 등 보조 실루엣 1개 | 전경·중경·후경 3단 실루엣 | 비대칭 영웅 실루엣과 고유 무대 장치 |
| 재질 | 2종 | 3종 + 부분 발광 | 4종 + 마법/기계 재질 | 5종 이상 + 고유 광원/공간 왜곡 |
| 모션 | 숨쉬기·고개짓 1루프 | 본체 + 소품 2루프 | 본체 + 소품 + 잔상 3루프 | 등장·대기·반응 3상태, 반복이 티 나지 않는 비동기 루프 |
| 이모티콘 표정 | 단일 감정, 큰 눈·입 | 감정 + 소품 반응 | 감정 전환 또는 환경 반응 | 짧은 서사와 변신/궁극기 순간 |
| 테두리 구조 | 조형 코너 2개 | 비대칭 코너 3개 + 1개 애니메이션 | 4변의 역할이 다른 다층 프레임 | 프레임 자체가 작은 장면이며 프로필 구멍은 항상 명확 |

공통 이미지 생성 지시: `transparent PNG, isolated collectible asset, premium fantasy game UI art, crisp silhouette at thumbnail size, no text, no watermark, no rectangular background, orthographic front view where applicable`. 프로필 이모티콘은 1024×1024, 동반자는 1024×1024 투명 배경, 이모티콘 테두리는 1536×1536 투명 배경을 기준으로 한다.

## 2. 동반자 40종

배치 기준: 메인 16:9 그래프 내부 우측 상단. 그래프 선과 데이터 점을 가리지 않도록 본체는 전체 그래프 폭의 9% 이내, 긴 꼬리·날개는 12% 이내. 클릭 영역과 시각 영역을 분리한다.

### 고급 — 마웨그 오리지널 10종

| ID | 전시명 | 실루엣·재질 | 표정/동작 | 이미지 생성 핵심 |
|---|---|---|---|---|
| `cp_u01` | 룬등불 도깨비 | 찌그러진 청동 랜턴 몸통, 짧은 뿔, 종이 불꽃 | 졸다가 기록 갱신 시 불꽃이 눈처럼 뜸 | squat bronze lantern imp, paper flame eyes, soot puffs, cozy Warcraft-like fantasy craft |
| `cp_u02` | 배낭 멧돼지 | 둥근 멧돼지와 과한 원정 배낭, 가죽·천·나무 | 땅을 킁킁대다 식량 꾸러미를 떨어뜨림 | tiny pack boar, oversized expedition backpack, leather straps, carved wood supplies |
| `cp_u03` | 우편박쥐 | 봉투형 날개와 밀랍 인장 배, 털·양피지 | 날갯짓하며 작은 기록 쪽지를 배달 | furry courier bat, envelope wings, wax seal belly, readable wing silhouette |
| `cp_u04` | 주전자 그리핀 | 주전자 몸체, 새 주둥이와 사자발, 놋쇠·도자 | 김을 뿜고 앞발로 찻잔을 밀어줌 | teapot gryphon hatchling, brass spout beak, porcelain body, steam curl |
| `cp_u05` | 수습 룬골렘 | 네모난 돌 몸통과 비대칭 팔, 암석·이끼 | 룬 조각을 맞추다 하나를 거꾸로 끼움 | apprentice rune golem, chunky stone blocks, moss seams, clumsy puzzle gesture |
| `cp_u06` | 버섯 약제사 | 큰 갓과 유리 약병 벨트, 균사·유리 | 약병을 흔들어 색 아닌 기포 모양이 변함 | mushroom apothecary, bottle belt, translucent spores, stout readable pose |
| `cp_u07` | 톱니 소라게 | 태엽 상자를 집으로 쓴 소라게, 구리·철 | 열쇠를 감고 옆걸음, 작은 톱니가 튐 | clockwork hermit crab, wind-up chest shell, copper claws, loose gear hop |
| `cp_u08` | 구름 가오리 | 납작한 구름 몸체와 빗방울 꼬리, 수증기 | 천천히 헤엄치며 한 번씩 작은 비 | palm-sized cloud manta, raindrop tail, soft vapor body, gentle glide |
| `cp_u09` | 양말 흉내괴물 | 꿰맨 양말 몸체, 단추눈, 실밥 촉수 | 그래프 선 움직임을 몸으로 따라 함 | stitched sock mimic, button eyes, yarn tendrils, playful line-following pose |
| `cp_u10` | 모래시계 올빼미 | 모래시계 배와 넓은 눈썹, 유리·목재·모래 | 고개 회전과 동시에 모래가 역류 | hourglass owl, glass belly, carved wood feathers, reversing sand animation cue |

### 희귀 — 조연·마스코트급 IP 연상 10종

| ID | 전시명(연상군) | 실루엣·재질 | 표정/동작 | 이미지 생성 핵심 |
|---|---|---|---|---|
| `cp_r01` | 꼬마 서리교수 (꼬마 켈투 계열) | 큰 해골 머리, 짧은 푸른 로브, 얼음 지팡이 | 엄숙하게 주문하다 재채기로 얼음가루 폭발 | chibi undead frost archmage professor, oversized skull, tiny robe, comic sneeze spell |
| `cp_r02` | 아기 멀록대장 (멀키 계열) | 물고기 눈, 왕관 조개, 짧은 삼지창 | 괴성을 지르며 물웅덩이에 미끄러짐 | baby amphibious murloc champion, shell crown, toy trident, wet slapstick pose |
| `cp_r03` | 황금자루 도굴꾼 (보물 고블린 계열) | 굽은 등과 거대 보따리, 금속·천·보석 | 동전 하나 떨어뜨리고 황급히 주움 | treasure-hoarding goblin courier, huge sack, dangling trinkets, startled greedy motion |
| `cp_r04` | 붉은 수정 탐사정 (프로토스 탐사정 계열) | 부유 수정핵과 세 갈래 금속 팔 | 광선을 쏘아 작은 수정 구조물 생성 | elegant alien crystal worker drone, three articulated arms, construction light beam |
| `cp_r05` | 점액 군주 새끼 (디아블로 보물/슬라임 계열) | 왕관을 삼킨 반투명 점액, 뼛조각 내포 | 통통 튀며 몸속 전리품이 굴러감 | translucent loot slime prince, swallowed crown, bones and coins suspended inside |
| `cp_r06` | 거미로봇 정찰병 (스타크래프트 계열) | 세 다리 구형 드론, 렌즈 눈, 스크랩 금속 | 벽면을 타고 미니 홀로그램 스캔 | compact three-legged sci-fi scout drone, lens eye, magnetic feet, scan cone |
| `cp_r07` | 푸른곰 응원대장 (두산 연상) | 파란 야구모자 쓴 통통한 곰, 천·가죽 | 미니 배트를 휘두르고 홈런 포즈 | cheerful blue baseball bear mascot, cap without logo, mini bat, stadium cheer pose |
| `cp_r08` | 쌍둥이 수호쥐 (LG 연상) | 흰색·적색 유니폼의 두 작은 우주쥐 | 서로 공을 던져 별 모양 궤적 생성 | twin space mice baseball mascots, white red uniforms, synchronized catch, star trail |
| `cp_r09` | 호랑이 신인타자 (KIA 연상) | 붉은 헬멧의 새끼 호랑이, 털·가죽 | 배트에 기대 으르렁대다 헬멧이 내려옴 | rookie tiger baseball mascot, red helmet no logo, confident growl then comic visor drop |
| `cp_r10` | 방패의 꼬마너구리 (마블 수호자 연상) | 원형 방패를 등에 진 너구리 기사 | 방패 굴리기를 시도하다 올라탐 | tiny raccoon shield-bearer, round segmented shield, heroic but mischievous |

### 영웅 — 주역급 IP 연상 10종

| ID | 전시명(연상군) | 실루엣·재질 | 표정/동작 | 이미지 생성 핵심 |
|---|---|---|---|---|
| `cp_e01` | 설원의 대마도사 (제이나 연상) | 비대칭 백금 머리, 서리 지팡이와 코트 자락 | 손 위에 소형 눈보라를 접어 넣음 | heroic blonde frost sorceress companion, naval mage coat, folding miniature blizzard |
| `cp_e02` | 대지망치 전쟁주술사 (스랄 연상) | 거대한 망치, 두꺼운 어깨, 늑대 장식 | 망치로 바닥을 찍어 룬 돌기둥 생성 | green-skinned war shaman, massive rune hammer, wolf motifs, earth pillar impact |
| `cp_e03` | 밴시의 검은 화살 (실바나스 연상) | 후드, 긴 활, 연기처럼 찢긴 망토 | 화살을 당기면 보랏빛 밴시 잔상 분리 | undead elven banshee archer, hooded silhouette, spectral duplicate drawing bow |
| `cp_e04` | 칼날날개 여사령관 (케리건 연상) | 인간형 중심과 네 쌍의 생체 칼날 날개 | 접힌 날개가 꽃처럼 열리며 포효 | psionic alien queen, articulated blade wings, regal stance, controlled psychic pulse |
| `cp_e05` | 네팔렘 성전사 (디아블로 성전사 연상) | 탑방패와 철퇴, 성서 띠, 판금 | 방패를 세우고 금빛 룬 장막 전개 | armored holy crusader, tower shield, flail, layered runic barrier, compact companion scale |
| `cp_e06` | 붉은 강철 거인 (아이언맨 연상) | 분절식 적금 장갑과 원형 흉부로 | 공중 정지 후 손바닥 추진기로 인사 | red gold powered armor hero, segmented plates, palm thrusters, compact heroic hover |
| `cp_e07` | 천둥망치 방랑신 (토르 연상) | 비대칭 망토, 짧은 손잡이 망치, 번개 땋은머리 | 망치가 손으로 돌아오며 작은 낙뢰 | wandering thunder god, short hammer, braided hair, returning weapon lightning arc |
| `cp_e08` | 차원문 의사 (닥터 스트레인지 연상) | 높은 깃과 다층 망토, 원형 손 제스처 | 두 개의 소형 포털로 찻잔을 이동 | mystic portal doctor, sentient layered cloak, circular glyph hands, playful portal trick |
| `cp_e09` | 암영 사냥꾼 (일리단 전 단계 연상) | 눈가리개, 초승달 쌍날, 접힌 악마날개 | 날개를 한 번 펴고 쌍날을 교차 | blindfolded demon hunter, crescent twin blades, folded bat wings, green fel embers |
| `cp_e10` | 은월 순찰대장 (블러드엘프 순찰대 연상) | 붉은 금빛 활, 긴 귀, 매 날개 견장 | 마법 매를 불러 함께 정찰 | crimson-gold elven ranger captain, hawk pauldrons, arcane bow, summoned scout hawk |

### 전설 — 상징적 보스·우주급 IP 연상 10종

| ID | 전시명(연상군) | 실루엣·재질 | 표정/동작 | 이미지 생성 핵심 |
|---|---|---|---|---|
| `cp_l01` | 서리왕의 메아리 (리치 왕 연상) | 가시 왕관 투구, 거대 룬검, 얼어붙은 망토 | 얼음 왕좌 잔상이 솟았다 눈송이로 붕괴 | chibi but imposing frozen death king, spiked crown helm, runeblade, spectral ice throne reveal |
| `cp_l02` | 배신자의 쌍월 (일리단 연상) | 거대한 악마날개와 초승달 쌍날, 문신 발광 | 눈가리개 틈 광선 뒤 공중 회전 착지 | legendary blind demon hunter, enormous ragged wings, twin crescent glaives, aerial landing |
| `cp_l03` | 대지파괴자의 잿불 (데스윙 연상) | 금속판으로 봉합한 흑룡 새끼, 용암 균열 | 몸이 갈라졌다 판금이 다시 죄어짐 | armored volcanic black dragon whelp, molten cracks, iron binding plates, seismic wingbeat |
| `cp_l04` | 불타는 지옥군주 (디아블로 연상) | 삼각 뿔과 척추 화염, 육중한 악마 실루엣 | 지면 균열에서 출현 후 불꽃을 삼킴 | prime hell demon lord miniature, triple horn crown, spine flames, portal emergence |
| `cp_l05` | 공허의 타락천사 (말티엘 연상) | 속 빈 후드, 여러 갈래 연기 날개, 쌍낫 | 몸이 까마귀 연기로 해체·재조립 | hooded angel of death, empty face, smoke wings, twin sickles, raven dissolve |
| `cp_l06` | 황금 함대 집행관 (프로토스 영웅 연상) | 금빛 외골격, 광자날 두 개, 등 부유 링 | 광자날을 끄고 염동력으로 룬을 정렬 | legendary alien templar executor, golden armor, twin energy blades, floating halo machinery |
| `cp_l07` | 우주석 건틀릿 군주 (타노스 연상) | 육중한 보라 전사와 여섯 보석 장갑 | 손가락 직전 멈추고 보석들이 궤도 운동 | cosmic titan warlord, gem gauntlet, orbiting stones, restrained snap moment |
| `cp_l08` | 심연의 붉은 마녀 (스칼렛 위치 연상) | 갈라진 관 형태 머리장식, 망토와 현실 균열 | 손 사이 배경 조각을 접어 나비로 변환 | crimson reality witch, crown silhouette, folding space shards into butterflies |
| `cp_l09` | 은하포식 구름고래 (우주적 존재 연상) | 별을 품은 거대 가오리·고래 혼합체 | 우측 상단 공간을 헤엄치며 작은 성운 방출 | cosmic void whale manta, galaxy interior, tiny nebula exhale, majestic slow pass |
| `cp_l10` | 삼두 황혼룡 (판타지 레이드 보스 연상) | 서로 다른 왕관의 세 머리와 찢긴 날개 | 세 머리가 서리·화염·공허 숨결을 교차 | legendary three-headed twilight dragon, distinct crowned heads, triple elemental breath braid |

## 3. 프로필 이모티콘 40종

원칙: 캐릭터 초상화가 아니라 **반응이 읽히는 이모티콘**이어야 한다. 64px에서도 눈·입·손동작 중 최소 두 요소가 명확해야 하며, 원형 마스크 안에서 귀·뿔·무기 일부가 의도적으로 밖으로 튀어나오는 알파 실루엣을 허용한다.

### 고급 10종

| ID | 전시명 | 표정·실루엣·재질 | 이미지 생성 핵심 |
|---|---|---|---|
| `pe_u01` | 승리한 오크 신병 | 아래 송곳니, 찌그러진 철 투구, 엄지척 | expressive green orc rookie, dented helmet, huge grin, thumbs up, sticker-like cutout |
| `pe_u02` | 졸린 달빛엘프 | 긴 귀와 초승달 머리핀, 반쯤 감긴 눈 | sleepy purple moon elf, long ears, moon hairpin, floating sleep rune |
| `pe_u03` | 당황한 수염드워프 | 수염 속에 숟가락이 낀 둥근 얼굴 | flustered dwarf cook, massive braided beard, spoon trapped inside, wide eyes |
| `pe_u04` | 집중한 소환수 | 작은 뿔, 혀를 내밀고 룬을 그림 | tiny horned imp concentrating, tongue out, finger drawing crooked rune |
| `pe_u05` | 기쁜 치유토템 | 나무 토템 얼굴, 잎사귀 팔 만세 | cheerful carved healing totem, leafy arms raised, warm inner light |
| `pe_u06` | 화난 공허슬라임 | 액체 눈썹과 삐죽한 수정 이빨 | angry void slime face, crystal teeth, liquid eyebrows, compressed bounce |
| `pe_u07` | 멍한 해골병 | 턱뼈를 거꾸로 낀 해골, 한쪽 눈 불꽃 | confused skeleton grunt, reversed jaw, one flickering soul eye |
| `pe_u08` | 응원하는 푸른곰 | 파란 모자와 야구공 볼, 포효 대신 미소 | blue baseball bear cheering, cap no logo, baseball cheek mark, open smile |
| `pe_u09` | 윙크하는 쌍둥이별 | 서로 반대 방향을 보는 두 얼굴 별 | twin star faces, one wink one gasp, white red sporty ribbon, no logo |
| `pe_u10` | 결의의 붉은호랑이 | 붉은 헬멧, 꽉 다문 입, 발톱 브이 | determined tiger cub baseball fan, red helmet no logo, claw V gesture |

### 희귀 10종

| ID | 전시명(연상군) | 표정·실루엣·재질 | 이미지 생성 핵심 |
|---|---|---|---|
| `pe_r01` | 꼬마 서리교수의 비웃음 | 해골 얼굴과 푸른 눈썹 불꽃, 작은 얼음 왕관 | chibi frost lich professor smug emote, skull face, icy brow flames |
| `pe_r02` | 멀록의 환호 | 물고기 입이 화면 절반, 물방울 왕관 | ecstatic baby murloc shout, giant fish mouth, splash crown, comic energy |
| `pe_r03` | 탐욕 도굴꾼 | 금화를 양볼에 물고 눈이 보석 모양 | greedy treasure goblin emote, coin-stuffed cheeks, gem pupils |
| `pe_r04` | 붉은 수정의 승인 | 외계 수정 얼굴, 빛나는 세 손가락 체크 | alien crystal probe personality, three-prong approval gesture, faceted lens expression |
| `pe_r05` | 성역의 겁쟁이 천사 | 후광은 크지만 날개로 눈을 가림 | timid little sanctuary angel, oversized halo, hiding face behind feather wings |
| `pe_r06` | 해병의 커피휴식 | 우주 헬멧 안 피곤한 얼굴과 빨대 | exhausted space marine inside bulky helmet, sipping coffee through tube |
| `pe_r07` | 거미영웅의 놀람 | 붉은 거미형 마스크의 눈 렌즈가 크게 확장 | acrobatic spider-masked hero surprised emote, expressive expanding white eye lenses |
| `pe_r08` | 초록 거인의 머쓱함 | 거대한 얼굴, 작은 붕대를 조심스레 붙임 | giant green powerhouse embarrassed, tiny bandage between huge fingers |
| `pe_r09` | 방패대장의 경례 | 푸른 가면, 이마에 작은 별 문양, 반듯한 경례 | patriotic shield captain inspired emote, blue mask, tiny star motif, crisp salute |
| `pe_r10` | 철갑천재의 자신감 | 열린 금속 얼굴판, 한쪽 눈썹과 홀로그램 수치 | powered armor genius smirk, lifted faceplate, holographic readout reflection |

### 영웅 10종

| ID | 전시명(연상군) | 표정·실루엣·재질 | 이미지 생성 핵심 |
|---|---|---|---|
| `pe_e01` | 서리대마법사의 냉소 | 백금 머리, 서리 왕관, 손 위 소형 눈보라 | blonde frost archmage confident emote, ice crown, miniature blizzard palm |
| `pe_e02` | 대지전쟁주술사의 포효 | 송곳니와 땋은머리, 배경 없이 번개 룬 | legendary orc shaman roaring, braided hair, lightning rune framing face |
| `pe_e03` | 밴시여왕의 침묵 | 후드 아래 붉은 눈, 입술 앞 검은 깃털 | undead banshee ranger queen hush emote, red eyes, black feather at lips |
| `pe_e04` | 칼날여왕의 만족 | 생체 왕관과 금빛 눈, 날개 끝이 턱을 받침 | psionic blade queen satisfied emote, organic crown, wing talon under chin |
| `pe_e05` | 성전사의 단호함 | 투구 눈구멍과 방패 윗선만으로 강한 표정 | holy crusader resolve emote, helmet slit expression, shield rim foreground |
| `pe_e06` | 천둥신의 폭소 | 땋은 수염, 번개가 치아 사이로 튐 | thunder god laughing, braided beard, lightning between teeth, dramatic sticker |
| `pe_e07` | 차원문의 의심 | 높은 깃, 한쪽 눈썹, 작은 포털 속 또 다른 표정 | mystic portal doctor skeptical, tiny portal showing alternate shocked face |
| `pe_e08` | 암영사냥꾼의 도발 | 눈가리개 아래 녹색 광선, 한 손 까딱 | blind demon hunter taunt emote, green eye glow under blindfold, beckoning hand |
| `pe_e09` | 붉은마녀의 분노 | 머리장식 실루엣, 얼굴 가장자리가 조각나 부유 | crimson reality witch rage, crown silhouette, floating face fragments |
| `pe_e10` | 우주너구리의 흥정 | 고글 쓴 너구리, 작은 폭탄과 계산기 | cosmic raccoon mercenary bargaining, goggles, tiny bomb, calculator |

### 전설 10종

| ID | 전시명(연상군) | 표정·실루엣·재질 | 이미지 생성 핵심 |
|---|---|---|---|
| `pe_l01` | 서리왕의 판결 | 투구 눈 틈에서 냉기, 얼굴 아래 룬검 반사 | frozen death king judgment emote, spiked helm, runeblade reflection, frost breath |
| `pe_l02` | 배신자의 각성 | 눈가리개가 갈라지며 양옆 날개가 원을 형성 | legendary demon hunter awakening emote, cracked blindfold, wings forming halo |
| `pe_l03` | 대지파괴자의 격노 | 흑룡 얼굴의 금속 봉합판이 벌어져 용암 노출 | armored volcanic dragon rage face, iron jaw plates splitting, molten core |
| `pe_l04` | 지옥군주의 환희 | 삼각 뿔 사이 지옥문, 불꽃 입꼬리 | prime hell demon triumphant emote, triple horns, tiny hell portal crown |
| `pe_l05` | 공허천사의 무표정 | 얼굴 없는 후드 안에 은하가 빨려 들어감 | faceless death angel emote, galaxy collapsing inside hood, smoke wings framing |
| `pe_l06` | 황금집행관의 초월 | 금빛 외계 가면이 열려 순수 광체 얼굴 노출 | transcendent golden alien executor, split ceremonial mask, pure psionic light face |
| `pe_l07` | 우주석 군주의 결심 | 턱을 굳게 다문 거인과 화면 밖 장갑 광원 | cosmic titan resolve emote, stern chin, colored gem lights from off-frame gauntlet |
| `pe_l08` | 불사조여왕의 재탄생 | 놀란 얼굴이 재로 흩어지고 웃는 얼굴로 복원 | phoenix queen rebirth reaction, ash-to-smile transformation, fiery feather crown |
| `pe_l09` | 별포식자의 배고픔 | 우주 고래 얼굴, 입속에 소형 은하 소용돌이 | adorable cosmic void whale hungry emote, galaxy vortex mouth, starry eyes |
| `pe_l10` | 삼두룡의 의견충돌 | 화난 머리·우는 머리·졸린 머리의 삼각 구도 | three-headed twilight dragon reaction, angry crying sleepy heads, iconic triangular crop |

## 4. 이모티콘 테두리 40종

원칙: 중앙 프로필 구멍은 지름의 최소 68%. 얼굴·표정 영역 침범 금지. 테두리 두께가 아니라 **건축·장비·생물·환경의 서로 다른 구조**로 다양성을 만든다. KBO 연상군은 실제 구단 로고를 복제하지 않고 색·동물·야구 도구의 조합으로 인지시킨다.

### 고급 10종

| ID | 전시명 | 구조·재질·모션 | 이미지 생성 핵심 |
|---|---|---|---|
| `eb_u01` | 그리핀 깃촉 | 좌하단 발톱, 우상단 깃털 다발, 양피지 링 | asymmetrical gryphon feather and claw portrait frame, parchment ring, open center 72% |
| `eb_u02` | 오크 북가죽 | 거친 가죽 띠, 뼈 이음못, 작은 천 깃발 | rugged orc hide frame, bone rivets, torn banner tabs, no circular neon |
| `eb_u03` | 룬석 관문 | 네 개의 각진 돌기둥 조각이 원을 만들지 않고 문틀 형성 | broken rune stone gateway portrait frame, moss seams, rectangular-arched silhouette |
| `eb_u04` | 약제사 선반 | 아래 약병 선반, 양옆 허브, 위 코르크 마개 | alchemist shelf portrait frame, glass vials, dried herbs, clear face opening |
| `eb_u05` | 톱니 작업대 | 비대칭 기어 3개와 렌치 걸쇠, 느린 기어 회전 | clockwork workbench frame, three functional gears, wrench clasp, brass and iron |
| `eb_u06` | 달빛 덩굴 | 초승달 가지와 잎사귀가 한쪽만 감싸는 C자 구조 | moonlit vine C-shaped portrait frame, silver leaves, open negative space |
| `eb_u07` | 푸른곰 덕아웃 | 아래 홈플레이트, 좌측 배트, 우측 파란 곰발 장갑 | blue bear baseball dugout frame, home plate base, bat and paw glove, no logo |
| `eb_u08` | 쌍둥이 야광봉 | 교차하지 않는 두 응원봉과 흰·적 리본, 별 파편 | twin baseball light-stick frame, white red ribbons, paired star caps, no logo |
| `eb_u09` | 붉은호랑 불펜 | 포수마스크 상단, 붉은 가죽 글러브 하단, 발톱 자국 | red tiger baseball bullpen frame, catcher mask crown, clawed glove base, no logo |
| `eb_u10` | 모래시계 기록관 | 상하 유리구, 좌우 목재 기둥, 모래가 아래로 흐름 | hourglass archive portrait frame, glass top-bottom bulbs, carved side pillars |

### 희귀 10종

| ID | 전시명(연상군) | 구조·재질·모션 | 이미지 생성 핵심 |
|---|---|---|---|
| `eb_r01` | 서리교수의 강의문 | 해골 장식 칠판 상단, 얼음 분필 룬, 책 더미 하단 | frost lich professor lecture frame, frozen chalk runes, skull lectern corners |
| `eb_r02` | 멀록 산란못 | 조개 껍데기 좌우, 물풀 아래, 위로 기포가 비정기 상승 | baby murloc tidepool frame, shells and reeds, irregular bubble animation cue |
| `eb_r03` | 도굴꾼의 보따리 | 금화 주머니가 아래 받침, 곡괭이와 열쇠가 비대칭 교차 | treasure goblin loot frame, sack base, pickaxe and keys, scattered gems |
| `eb_r04` | 붉은 수정 회로 | 삼각 수정 네 개가 금속 관절로 연결, 에너지 펄스 순환 | alien crystal circuit frame, articulated metal links, angular non-circular energy path |
| `eb_r05` | 저그 산란고리 | 키틴 갑각이 세 방향에서 자라고 점액막은 중앙 밖에만 | organic alien brood frame, chitin mandibles, pulsing outer membrane, clean center |
| `eb_r06` | 성역의 네팔렘 문장 | 철제 방패 파편, 천사 깃털 한쪽, 악마뿔 반대쪽 | sanctuary duality frame, broken shield, angel feather versus demon horn |
| `eb_r07` | 거미줄 도시창 | 건물 철골 코너와 비대칭 거미줄, 작은 가면 눈 렌즈 | urban spider-hero inspired frame, steel corners, asymmetrical webbing, lens clasp |
| `eb_r08` | 방패별 전선 | 분할 원형 방패가 완전한 링이 아닌 세 조각으로 부유 | shield captain inspired portrait frame, three floating shield segments, battle scratches |
| `eb_r09` | 강철연구실 | 기계 팔 두 개와 흉부로 모양 전원부, 얇은 HUD 파편 | powered armor lab frame, articulated robot arms, arc-shaped power core base |
| `eb_r10` | 수호자 화분 | 우주선 금속 화분에서 나무 팔이 좌우로 자라남 | cosmic tree guardian planter frame, spacecraft metal pot, expressive branch arms |

### 영웅 10종

| ID | 전시명(연상군) | 구조·재질·모션 | 이미지 생성 핵심 |
|---|---|---|---|
| `eb_e01` | 설원의 비전탑 | 얼음 첨탑 두 개, 마법서 하단, 눈보라가 바깥쪽으로만 흐름 | frost archmage tower portrait frame, twin ice spires, spellbook base, outward blizzard |
| `eb_e02` | 대지망치 제단 | 좌측 거대 망치머리, 우측 늑대 토템, 하단 갈라진 바위 | war shaman altar frame, hammer head, wolf totem, cracked stone base, lightning runes |
| `eb_e03` | 밴시의 검은시위 | 긴 활이 왼쪽 C자, 오른쪽 망토 파편과 검은 화살 세 개 | banshee ranger frame, bow forming one side, spectral cloak shards, three black arrows |
| `eb_e04` | 칼날군체 왕좌 | 생체 칼날 네 개가 중앙 밖으로 열리고 신경다발이 맥동 | psionic alien queen throne frame, four outward blade limbs, pulsing neural cords |
| `eb_e05` | 성전사의 성광문 | 고딕 아치, 탑방패 기둥, 철퇴 추가 좌우로 느리게 흔들림 | holy crusader cathedral arch frame, shield pillars, hanging flail censer, stained light |
| `eb_e06` | 천둥왕의 무지개다리 | 부서진 돌다리 아래, 망치 상단, 다층 번개가 좌우 연결 | thunder god rainbow-bridge frame, broken stone base, hammer crown, branching lightning |
| `eb_e07` | 차원문의 만다라 | 서로 다른 원근의 금속 링 3개와 망토 깃, 링이 역회전 | mystic portal doctor frame, three perspective glyph rings, sentient cloak collar |
| `eb_e08` | 암영사냥꾼의 감옥문 | 초승달 쌍날이 좌우 기둥, 찢긴 날개가 상단 아치 | demon hunter prison gate frame, twin crescent glaive pillars, ragged wing arch |
| `eb_e09` | 붉은마녀의 현실균열 | 테두리 네 조각이 서로 다른 깊이에 떠 있고 붉은 실로 연결 | reality witch frame, four floating architectural shards, crimson energy threads |
| `eb_e10` | 은월 순찰대 관문 | 붉은 금속 세공, 매 날개 상단, 화살통 하단, 초록 보석 맥동 | blood-elf-like ranger gate frame, crimson gold filigree, hawk wing crown, quiver base |

### 전설 10종

| ID | 전시명(연상군) | 구조·재질·모션 | 이미지 생성 핵심 |
|---|---|---|---|
| `eb_l01` | 서리왕의 얼음왕좌 | 가시 왕좌 등받이, 룬검이 한쪽 기둥, 사슬과 서리 안개 | legendary frozen throne portrait frame, spiked backrest, runeblade pillar, drifting chains |
| `eb_l02` | 배신자의 검은사원문 | 악마 석상 두 개, 황천 균열 상단, 초승달 쌍날 하단 잠금 | legendary black temple gate frame, demon statues, fel rift crown, glaive lock base |
| `eb_l03` | 대지파괴자의 용암갑주 | 검은 용비늘 판금이 네 방향에서 벌어지고 용암맥이 그 사이 흐름 | volcanic dragon armor frame, separating black scale plates, molten veins, quake dust |
| `eb_l04` | 지옥군주의 공포문 | 삼각 뿔 아치, 척추뼈 기둥, 아래 작은 지옥문에서 불길 상승 | prime hell lord terror gate frame, triple-horn arch, vertebra pillars, infernal portal base |
| `eb_l05` | 공허천사의 영혼회랑 | 얼굴 없는 후드 상단, 연기 날개가 양옆 복도, 쌍낫 끝이 하단에서 만남 | death angel soul corridor frame, empty hood crown, smoke wing walls, twin sickle base |
| `eb_l06` | 황금함대 승천환 | 단절된 황금 건축물 세 층과 광자날 기둥, 중심 밖에서 별빛 유입 | golden alien fleet ascension frame, tiered architecture, energy blade pillars, stellar rays |
| `eb_l07` | 우주석 운명고리 | 여섯 보석은 각자 다른 조형 소켓, 거대 장갑 손가락이 하단 받침 | cosmic gem gauntlet frame, six distinct sculpted sockets, armored fingers as base |
| `eb_l08` | 불사조 태양왕관 | 깃털이 불꽃→재→금속으로 변하는 좌우 비대칭 날개, 알 껍질 하단 | phoenix rebirth crown frame, asymmetric material-transition feathers, cracked egg base |
| `eb_l09` | 별포식자의 성운턱 | 우주고래의 위·아래 턱이 프레임, 수염은 혜성, 내부 중앙은 완전 투명 | cosmic void whale jaw frame, comet baleen, nebula fins, perfectly clear portrait center |
| `eb_l10` | 삼두 황혼용문 | 세 용머리가 상·좌·우를 지키고 각각 다른 건축 기둥으로 이어짐 | three-headed twilight dragon portal frame, three guardian heads, distinct elemental pillars |

## 5. 제작·적용 순서

1. 각 범주에서 고급 2종, 희귀 2종, 영웅 1종, 전설 1종을 먼저 생성해 실루엣 차별화와 축소 가독성을 검증한다.
2. 64px·96px·144px 썸네일 테스트를 통과한 콘셉트만 같은 등급의 나머지 원화로 확장한다.
3. 동반자는 실제 16:9 그래프 우측 상단에 올려 선·최저점·트로피와 겹침을 검사한다.
4. 프로필 이모티콘과 테두리는 임의 조합 20쌍을 만들어 얼굴 구멍 침범, 주제 충돌, 어두운 배경 대비를 검사한다.
5. KBO 연상군은 실물 구단 문양·영문 이니셜을 넣지 않은 버전과 내부 전용 근접 버전을 별도 관리한다.
6. 실제 상품 가격은 원화 QA와 모션 제작비가 확정된 뒤 등급별 기준가에 따라 일괄 산정한다. 이 문서는 가격 확정 문서가 아니다.

## 6. 최종 QA 통과 기준

- 같은 범주 안에서 외곽 실루엣만 검은색으로 채웠을 때 40종 중 36종 이상을 구분할 수 있다.
- 고급과 전설은 발광을 제거한 정지 이미지에서도 레이어 수·재질·서사 장치의 차이가 보인다.
- 모든 프로필 이모티콘은 64px에서 감정이 식별되고, 모든 테두리는 중앙 얼굴 68% 이상을 보존한다.
- 동반자는 16:9 그래프 데이터 안전영역을 침범하지 않으며, 애니메이션 최대 이동폭도 원래 점유 상자의 15% 이내다.
- 어떤 항목도 기존 도안의 단순 색상 교체로 승인하지 않는다.
- 서로 다른 테마를 섞어도 한 항목이 다른 항목을 시각적으로 완전히 압도하지 않는다.
