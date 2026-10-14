"use client";

function MenuError({ error, reset }) {
    return(
        <main>
            <h1> Something went wrong.</h1>
            <p> {error.message}</p>

            <button onClick={() => reset()}>Try again</button>
        </main>
    );
}
export default MenuError;
