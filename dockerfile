FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app

RUN npx playwright install --with-deps

EXPOSE 9323

CMD ["npx", "playwright", "test"]
