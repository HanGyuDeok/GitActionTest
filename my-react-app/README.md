아래는 **README.md** 파일로 적합한 형태로 다시 작성한 예시입니다.

---

```markdown
# React + Vite 프로젝트 CI/CD 선행 준비사항

이 문서는 React + Vite 프로젝트를 GitHub Actions, Docker, Kubernetes, Argo CD를 이용해 CI/CD 환경을 구축하기 위해 필요한 사전 준비사항과 핵심 개념을 정리한 문서입니다.

---

## 1. 프로젝트 기본 구조

```

myapp/
├─ my-react-app/         # React + Vite 프로젝트 소스 코드 및 Dockerfile 위치
├─ k8s/                  # Kubernetes 매니페스트 파일 위치
└─ .github/
└─ workflows/       # GitHub Actions 워크플로우 YAML 파일 위치

````

---

## 2. Dockerfile 작성

- `my-react-app/` 폴더 내에 반드시 `Dockerfile`이 존재해야 합니다.
- React 앱을 빌드하고, 빌드 결과물을 Nginx 서버에서 서빙하는 멀티 스테이지 Dockerfile 예시:

```Dockerfile
# 1단계: 빌드
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: 프로덕션 서버
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
````

---

## 3. DockerHub 계정 및 GitHub Secrets 설정

* Docker 이미지를 저장할 DockerHub 계정을 생성합니다.
* GitHub 저장소 설정에서 **Secrets**에 다음을 등록해야 합니다:

    * `DOCKER_USERNAME`: DockerHub 사용자명
    * `DOCKER_PASSWORD`: DockerHub 비밀번호 또는 Access Token

---

## 4. GitHub Actions 워크플로우 준비

* `.github/workflows/ci-cd.yml` 파일에 다음 작업을 포함합니다:

    * DockerHub 로그인
    * 도커 이미지 빌드 및 DockerHub로 푸시
    * Kubernetes 매니페스트의 이미지 태그 업데이트 및 커밋 자동화 (필요 시)

---

## 5. Kubernetes 매니페스트 준비

* `k8s/` 폴더 내에 Deployment, Service 등 매니페스트 파일을 작성합니다.
* 매니페스트 내 이미지 태그 부분은 자동 업데이트가 가능하도록 설정하거나, 워크플로에서 템플릿 치환 스크립트를 사용합니다.

예시:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-react-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-react-app
  template:
    metadata:
      labels:
        app: my-react-app
    spec:
      containers:
      - name: my-react-app
        image: your-dockerhub-id/my-react-app:latest  # 워크플로우에서 업데이트 가능
        ports:
        - containerPort: 80
```

---

## 6. Argo CD 설치 및 설정

* Kubernetes 클러스터에 Argo CD를 설치합니다.
* GitOps 방식으로 GitHub 저장소의 `k8s/` 매니페스트를 모니터링하며 자동 동기화하도록 설정합니다.

---

## 7. 요약

| 준비 사항                | 설명                             |
| -------------------- | ------------------------------ |
| Dockerfile           | React 앱을 컨테이너 이미지로 빌드하기 위한 파일  |
| DockerHub & Secrets  | Docker 이미지 저장소 및 인증 정보         |
| GitHub Actions 워크플로우 | CI/CD 자동화를 위한 빌드, 테스트, 배포 스크립트 |
| Kubernetes 매니페스트     | 클러스터에 배포할 앱 설정 파일              |
| Argo CD              | GitOps 기반 자동 배포 및 관리 도구        |

---

## 8. 참고 링크

* [Docker 공식 문서](https://docs.docker.com/)
* [Kubernetes 공식 문서](https://kubernetes.io/ko/docs/)
* [Argo CD 공식 문서](https://argo-cd.readthedocs.io/en/stable/)
* [GitHub Actions 공식 문서](https://docs.github.com/en/actions)

---

필요시 각 단계별 구체적인 설정 및 예제 코드를 별도로 안내해 드릴 수 있습니다.
궁금한 점이나 추가 요청이 있으면 언제든 말씀해 주세요.

```

---

필요하면 바로 이 파일로 저장해서 GitHub 루트에 올리시면 됩니다!  
추가 요청도 편하게 주세요 :)
```
좋아, 요청한 내용을 기준으로 이 프로젝트를 **처음 시작하는 사람도 따라할 수 있는 CI/CD 및 Kubernetes 배포 가이드**로 정리해서 3부로 나눠 제공할게.

---

## 📦 **\[1부] CI/CD의 흐름 및 준비 작업**

### ✅ 1. 전체 아키텍처 흐름

```text
개발 → GitHub Commit/Push → GitHub Actions로 CI 실행
     └─ React 앱 빌드 및 Docker 이미지 생성
         └─ DockerHub에 이미지 푸시
             └─ (CD 예정) Kubernetes가 최신 이미지 pull → 배포
```

---

### ✅ 2. 사전 준비 (계정 & 권한 설정)

| 항목                | 내용                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| GitHub 계정         | CI/CD를 위한 GitHub Actions 연동용                                                                                                         |
| DockerHub 계정      | 이미지를 저장할 Private/Public 저장소                                                                                                          |
| DockerHub Token   | GitHub Secrets에 등록할 인증용 토큰<br>[https://hub.docker.com](https://hub.docker.com) → \[계정] → Security → Access Token 발급                  |
| GitHub Secrets 설정 | `Settings > Secrets and variables > Actions` → 다음 값 추가:<br>`DOCKERHUB_USERNAME` = Docker ID<br>`DOCKERHUB_TOKEN` = 발급받은 Access Token |

---

### ✅ 3. 프로젝트 구조 예시

```plaintext
GitActionTest/
├── my-react-app/
│   ├── Dockerfile
│   └── (React 프로젝트 파일들)
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

---

### ✅ 4. Dockerfile 예제 (`my-react-app/Dockerfile`)

```Dockerfile
# 빌드 스테이지
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 배포 스테이지
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

---

### ✅ 5. GitHub Actions 설정 파일 (`.github/workflows/ci.yml`)

```yaml
name: React CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 🔄 Checkout 코드
        uses: actions/checkout@v4

      - name: 🐳 Docker 로그인
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 🐳 Docker 이미지 빌드 및 푸시
        uses: docker/build-push-action@v3
        with:
          context: ./my-react-app
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-react-app:${{ github.sha }}
```

> 💡 참고: `${{ github.sha }}`는 커밋 해시 기반으로 이미지 태그를 고유하게 만들어줍니다.

---

## 💡 6. 로컬에서 필요한 명령어

```bash
# Docker 설치 (Ubuntu 기준)
sudo apt update && sudo apt install docker.io -y

# Docker 실행 확인
docker --version

# Git 설치 및 초기 설정
sudo apt install git -y
git config --global user.name "HanGyuDeok"
git config --global user.email "your-email@example.com"

# React 프로젝트 생성 (필요 시)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

---

## 다음 단계 (예고)

* **\[2부] Kubernetes 클러스터 구성 및 배포**

  * Minikube or 클라우드(K8s)
  * 배포용 manifest 파일 (Deployment, Service, Ingress 등)
  * Docker 이미지 배포 자동화

* **\[3부] CD 자동화 및 Argo CD 연동**

  * GitOps 기반 자동화 흐름
  * Argo CD 실습 구성
  * 실시간 배포 자동화

---
# 🌐 React + Docker + GitHub Actions + Kubernetes (CI/CD) 풀 가이드

이 문서는 React 프로젝트를 기반으로 Docker, GitHub Actions, Kubernetes를 활용해 **CI/CD 전체 파이프라인을 구축**하는 방법을 순서대로 설명합니다. 초심자도 따라할 수 있도록 최대한 상세하게 구성되어 있습니다.

---

## 📦 1단계: 프로젝트 구조 및 준비

### 🔧 필수 조건

* Docker Hub 계정 생성 → [https://hub.docker.com/](https://hub.docker.com/)
* GitHub 저장소 생성 → `GitActionTest` (예시)
* Docker 설치 → [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
* kubectl, Minikube 설치 (로컬 테스트용) 또는 실제 Kubernetes 클러스터 (예: GKE, EKS 등)

### 🗂️ 프로젝트 디렉토리 구조 예시

```
GitActionTest/
├── my-react-app/          # Vite 또는 CRA로 생성한 프론트엔드
│   ├── Dockerfile         # 프론트엔드 Docker 설정
│   └── ...                # 기타 프론트엔드 리소스
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions 워크플로우 파일
├── k8s/
│   ├── deployment.yaml    # Kubernetes 배포
│   ├── service.yaml       # Kubernetes 서비스
│   └── ingress.yaml       # (옵션) Ingress 설정
└── README.md
```

---

## 🐳 2단계: Docker 설정

### 📄 `my-react-app/Dockerfile`

```Dockerfile
# 베이스 이미지
FROM node:18-alpine as build

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### ✅ 로컬에서 테스트 (선택사항)

```bash
cd my-react-app
docker build -t my-react-app .
docker run -p 8080:80 my-react-app
```

---

## 🔐 3단계: GitHub Secrets 설정

GitHub 저장소 → **Settings > Secrets and variables > Actions** 에서 아래 추가:

* `DOCKERHUB_USERNAME` : Docker Hub ID
* `DOCKERHUB_TOKEN` : Docker Hub에서 생성한 Access Token
* (선택) `GH_PAT` : GitHub Personal Access Token (자동 커밋/푸시 시 필요)

---

## ⚙️ 4단계: GitHub Actions 워크플로우 설정

### 📄 `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: ["main"]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: 📂 Checkout 코드
        uses: actions/checkout@v3

      - name: 🐳 Docker 로그인
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 🐳 Docker 빌드 및 푸시
        uses: docker/build-push-action@v3
        with:
          context: ./my-react-app
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-react-app:${{ github.sha }}
```

---

## 🚀 5단계: Kubernetes 배포 설정

### 📄 `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: react
  template:
    metadata:
      labels:
        app: react
    spec:
      containers:
      - name: react-container
        image: hangyudeok/my-react-app:latest  # SHA 대신 latest로 태그 교체 가능
        ports:
        - containerPort: 80
```

### 📄 `k8s/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: react-service
spec:
  selector:
    app: react
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

---

## ⛵ 6단계: Kubernetes에 배포하기

### 💻 로컬 테스트 (Minikube 기준)

```bash
# 클러스터 시작
minikube start

# 배포
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# IP 확인
minikube service react-service
```

---

## 📌 요약: 커맨드 모음

```bash
# 도커 빌드 및 푸시
cd my-react-app
docker build -t hangyudeok/my-react-app:latest .
docker push hangyudeok/my-react-app:latest

# Kubernetes 적용
kubectl apply -f k8s/
```

---

## 📘 다음 문서 예고

* Ingress + TLS (HTTPS 인증서 설정)
* 이미지 자동 버전 관리 및 latest 유지 전략
* Argo CD를 통한 GitOps 방식 CD 구성
* Production 배포를 위한 Helm 템플릿화




