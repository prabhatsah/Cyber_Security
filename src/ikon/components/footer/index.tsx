import Image from "next/image";

function Footer() {
  return (
    <footer className="flex border-t bg-secondary text-secondary-foreground px-4 py-2 justify-center lg:justify-start">
      <div className="flex gap-2 items-center">
        <span>Powered By</span>
        <a href="https://keross.com" target="_blank">
          <Image
            src="/assets/images/dark/keross-logo.png"
            alt="Keross"
            width={80}
            height={15}
          />
        </a>
        <span className="">|</span>
        <span id="txtCopyrightYear" className="">
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
