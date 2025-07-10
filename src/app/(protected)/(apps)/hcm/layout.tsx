import { ReactNode } from "react";
export default async function layout({ children }: { children: ReactNode }) {

    return (
        <>
            {children}
        </>
    )
}
