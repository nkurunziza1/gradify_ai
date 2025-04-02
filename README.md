# AI-Driven student distributor

- [Installation](#installation)
- [Deployment](#deployment)
- [Manually Test](#test)

AI and Blockchain Powered Student-School Allocation System, is an innovative Ed-Tech solution designed to match students to schools based on their grades, preferences, and available school capacity. By leveraging cutting-edge AI, it ensures fair and efficient placements, while also considering the status of each school. The system fills schools optimally without overcrowding and adjusts in real-time as new data comes in.

To enhance trust and transparency, this Ed-Tech system integrates blockchain technology. Every decision in the student placement process is securely recorded and cannot be altered, offering a clear and reliable way for students, parents, and schools to understand how decisions are made, ensuring fairness for everyone involved.

## Installation

## Requirements

```bash
dfx Version: 0.24.3
```

## Get started and installation

Clone the [gradify_ai](https://github.com/nkurunziza1/gradify_ai) repository:

1. Clone the repository:

```bash
git clone https://github.com/nkurunziza1/gradify_ai
cd gradify_ai
npm install

```

2. Start server

In a root terminal `gradify_ai` directory:

```bash
dfx start --clean --host 127.0.0.1:4943
```

Open another terminal in the `gradify_ai` directory:

```bash
cd src/frontend
Create env file  `touch .env`
add openai api key
VITE_OPENAI_API_KEY=AIzaSyBhmbMLHWi6vsMyqS6UjOhQT9h9iS8RLmw
npm install
```

Check If you have all environment variables

```bash
.Env
VITE_OPENAI_API_KEY=AIzaSyBhmbMLHWi6vsMyqS6UjOhQT9h9iS8RLmw
```

## Deployment

In a separate terminal in the `gradify_ai` directory:

```bash
dfx deploy
```

View your frontend in a web browser at `http://[canisterId].raw.localhost:8000`. You should add `raw` between canister Id and localhost



## Test

What we are going to do here is test the functionalities of our application. First you are an accredited institution you will have to access this link https://gov-qr-code-enerator.vercel.app/ to get qr code for sign in(either scan the downloaded qr code or upload downloaded qr code) ,And navigate to distribute student tab then import it automatically, then  distribute students to schools, that were imported.
