import prompt from "../../lib/prompt";

export default async function login() {
  const username = await prompt("username > ");
  const password = await prompt("password > ", { is_hidden: true });
  console.log(username.toString());
  console.log(password.toString());
}
