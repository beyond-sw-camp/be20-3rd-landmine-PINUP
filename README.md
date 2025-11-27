# 🌍 PIN-UP 프로젝트 개요

여행을 기록하고, 영토를 넓히며, 전국을 점령하라!  
**PIN-UP(Pin-Up)**은 국내 여행 경험을 *데이터와 시각화로 즐기는* 새로운 형태의 여행 기록 서비스입니다.

---

## 🧩 프로젝트 개요

최근 MZ세대를 중심으로 **여행 인증·기록 문화**가 빠르게 확산되며,  
단순히 방문을 기록하는 단계를 넘어  
**경쟁 요소와 시각적 재미를 제공하는 서비스**에 대한 수요가 증가하고 있습니다.

PIN-UP은 사용자가 실제 방문한 지역을  
**지도 위 ‘영토(territory)’로 점령하는 방식**으로 여행을 기록하게 합니다.

이를 통해
- 나만의 여행 지도 만들기
- 지역 정복 현황 시각화
- 월간·전체 랭킹 경쟁
- 여행 기록 기반의 커뮤니티 요소

등을 제공하는 **게임형 여행 기록 플랫폼**입니다.

국내 여행을 더욱 흥미롭고 도전적으로 만드는 새로운 경험을 목표로 합니다.


# 🛠 Tech Stack

## 💻 Backend
<p>
  <img src="https://img.shields.io/badge/Java-007396?logo=openjdk&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Spring%20Cloud-6DB33F?logo=spring&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?logo=springsecurity&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/JPA-59666C?style=flat-square"/>
  <img src="https://img.shields.io/badge/JWT-black?logo=jsonwebtokens&style=flat-square"/>
  <img src="https://img.shields.io/badge/MyBatis-b31b1b?style=flat-square"/>
</p>

---

## 🎨 Frontend
<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black&style=flat-square"/>
  <img src="https://img.shields.io/badge/Vue.js-42b883?logo=vuedotjs&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Fetch%20API-black?style=flat-square"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square"/>
  <img src="https://img.shields.io/badge/dayjs-black?style=flat-square"/>
</p>

---

## 🪄 Design
<p>
  <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white&style=flat-square"/>
</p>

---

## 🗄️ Database
<p>
  <img src="https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/MyBatis-b31b1b?style=flat-square"/>
</p>

---

## ⚙️ Tools
<p>
  <img src="https://img.shields.io/badge/Notion-000000?logo=notion&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Google%20Sheets-34A853?logo=google%20sheets&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/ERD%20Cloud-4285F4?style=flat-square"/>
  <img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000?logo=intellijidea&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/VS%20Code-007ACC?logo=visualstudiocode&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white&style=flat-square"/>
</p>

# ✨ 주요 기능 (Features)

## 🔐 Auth (인증)

### 👤 사용자(User)
- Google / Kakao / Naver OAuth2 기반 **소셜 로그인**
- 외부 플랫폼 인증 후 사용자 정보 자동 저장
- 세션 기반 사용자 로그인 상태 관리

### 🛡 관리자(Admin)
- **JWT 기반 인증**
- Access / Refresh Token 발급 및 검증
- 관리자 전용 세션/보안 처리

---

## ⚙️ Config (환경 설정)
- 글로벌 설정 및 **공통 예외 처리**
- CORS 설정
- Spring Security 환경 구성
- Swagger 기반 API 문서 자동화

---

## 🏳️ Conquer (영토 점령)
- 사용자의 실제 방문 지역을 **지도 기반으로 점령 등록**
- 지역 좌표(Polygon / GPS)와 연동된 점령 정보 저장
- 지역별 점령 이력 조회 & 정복 현황 **시각화**

---

## 📝 Feed (피드)
- 유저별 여행 기록 피드 생성
- 게시글 **작성 / 수정 / 삭제**
- 좋아요, 댓글 등 **소셜 인터랙션 기능**
- 사진 기반 여행 기록 관리

---

## 🏠 Home (홈)
- 서비스 메인 화면
- 요약 통계(점령 수, 활동 포인트)
- 최근 점령 지역 / 최신 공지 요약 표시
- 오늘의 추천 기능(선택)

---

## 👥 Member (회원)
- 회원 프로필 조회 및 수정
- 닉네임 / 성별 / 선호 지역 관리
- 포인트, 활동 통계, 등급 표시
- 내 점령 지역 리스트 조회
- 구매한 아이템 조회 및 적용

---

## 📢 Notice (공지)
- 공지사항 **등록 / 수정 / 조회**
- 업데이트 알림 및 이벤트 안내

---

## 🔔 Notification (알림)
- 점령, 댓글, 좋아요 등 **실시간 알림**
- 읽음 / 미확인 상태 관리
- SSE(Server-Sent Events) 기반 실시간 푸시

---

## 🏆 Ranking (랭킹)
- 점령 지역 수 + 활동 점수 기반 순위 산정
- **지역별 / 전국 단위 랭킹 제공**
- 월별 랭킹 자동 집계(스케줄러 연동)

---

## 📊 Report (리포트)
- 여행 통계 자동 생성
- 방문 횟수, 점령 비율 분석
- 지역별 정복 현황 **지도 시각화**

---

## 🛒 Store (상점)
- 아이템 목록 / 카테고리별 조회
- 아이템 **구매 / 장착 / 해제**
- 한정판 테마, 이벤트 아이템 관리


## 🗂️ 요구사항 명세서
[👉 요구사항명세서 자세히 보기](https://docs.google.com/spreadsheets/d/1Zkx9firrpHB_p1HVR-SOyMTRuEOYPh6jcCsCMcN00kU/edit?gid=113130719#gid=113130719)
<br><br>

## 📋 와이어프레임
[👉 와이어프레임 자세히 보기](https://www.figma.com/design/ijWgL81qNKehtyY8nsjgwV/PIN-UP?node-id=0-1&p=f&t=K7tTnCVhZXM4uh7F-0)
<br><br>

## 🧩 화면설계서
[👉 화면설계서 자세히 보기](https://docs.google.com/spreadsheets/d/15GUetaqF7ZzyMlfNaMSTGY3QHphQJDatddCM2ZH7ZNg/edit?gid=0#gid=0)
<br><br>

## ✅ 테스트 케이스

<details>
  <summary>로그인</summary>

- 구글 로그인<br>
  ![Image](https://github.com/user-attachments/assets/e7f5e196-9fc2-4a84-aaba-e3ce22eca34e)

- 네이버 로그인<br>
  ![Image](https://github.com/user-attachments/assets/88810a05-d6ce-4365-81c3-bf9d27716fce)

- 카카오 로그인<br>
  ![Image](https://github.com/user-attachments/assets/ff5d2d9e-0763-4720-9d23-7a192bcc4613)

- 관리자 로그인<br>
  ![Image](https://github.com/user-attachments/assets/fc78136b-ccff-46f2-804e-b545005132f1)

</details>

<details>
  <summary>관리자 회원관리</summary>

- 회원 정지<br>
  ![Image](https://github.com/user-attachments/assets/a6ea0053-7797-4360-9d43-6ae854b40bc7)

- 회원 활성화<br>
  ![Image](https://github.com/user-attachments/assets/d817200c-ceda-4bb8-85a6-0452cee3513d)

- 페이지네이션<br>
  ![Image](https://github.com/user-attachments/assets/15c6df88-d63d-44e7-bf19-ea32d56ec23e)

</details>

<details>
  <summary>홈 화면</summary>

- 홈<br>
  <img width="700" alt="Image" src="https://github.com/user-attachments/assets/a4690cc2-711d-46d5-827c-4e690a3f9948" />
- 랭킹 전체보기<br>
  ![Image](https://github.com/user-attachments/assets/7bce638d-865f-42c5-9697-aa79b618ac79)

- 공지사항 이동<br>
  ![Image](https://github.com/user-attachments/assets/832f345c-eba1-4564-9257-f7ad36fda381)

</details>

<details>
  <summary>마이페이지</summary>

- 회원 정보 수정<br>
  ![Image](https://github.com/user-attachments/assets/f6fc7db4-8600-419c-9d8f-475d033527a9)

- 포인트 상세 내역 조회 이동<br>
  ![Image](https://github.com/user-attachments/assets/61697c32-2141-4d4a-b0bb-00da00d0ff8c)

- 내 피드 모아보기&클릭시 해당 피드로 이동<br>
  ![Image](https://github.com/user-attachments/assets/ccbdd0d2-cfb9-46c6-81a6-a6ddc70a24bc)

</details>

