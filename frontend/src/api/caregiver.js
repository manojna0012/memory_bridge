const BASE_URL = "http://localhost:5000";

export const getPeople = async () => {
  const res = await fetch(`${BASE_URL}/api/people`);
  return res.json();
};

export const addPerson = async (person) => {
  const res = await fetch(`${BASE_URL}/api/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(person),
  });
  return res.json();
};

export const chatWithBot = async (message) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
};