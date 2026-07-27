import axios from "axios";

export const api = axios.create({
  baseURL: "https://dawnbrandbots.github.io/yaml-yugi-limit-regulation",
  timeout: 10_000,
});
