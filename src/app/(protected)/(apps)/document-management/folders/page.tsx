import Link from 'next/link';

export default function ErrorPage() {
    return (
        <div>
            <h1>Error</h1>
            <p>Sorry, something went wrong.</p>
            <Link href="/">Go back to Home</Link>
        </div>
    );
}

