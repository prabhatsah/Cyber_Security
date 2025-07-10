import Image from 'next/image'
import React from 'react'
import IkonLogoDark from "../../../public/assets/images/dark/ikon-logo.png";

function IkonLogo() {
    return (
        <Image src={IkonLogoDark} alt="ikon-logo" height={56} width={190} />
    )
}

export default IkonLogo