import { signIn, signOut, useSession } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <h1>Sign In</h1>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("credentials", {
                email: e.target.email.value,
                password: e.target.password.value,
              });
            }}
          >
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Sign in</button>
          </form>
        </>
      )}
    </div>
  );
}
