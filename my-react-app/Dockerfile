# 1단계: Node.js 경량 이미지에서 앱 빌드
FROM node:20-alpine AS builder

# 작업 디렉토리 생성 및 이동
WORKDIR /app

# package.json과 package-lock.json 복사 (의존성 설치 준비)
COPY package*.json ./

# 의존성 설치
RUN npm install

# 프로젝트 전체 복사
COPY . .

# React 앱 빌드 (빌드 결과는 /app/dist 에 생성됨)
RUN npm run build

# 2단계: Nginx 경량 이미지에서 빌드 결과물 서빙
FROM nginx:alpine

# 빌드 단계에서 생성된 dist 폴더를 Nginx 기본 html 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 컨테이너가 외부와 통신할 포트 설정 (80번 포트)
EXPOSE 80

# Nginx 데몬 포그라운드 실행 (컨테이너가 종료되지 않도록)
CMD ["nginx", "-g", "daemon off;"]
