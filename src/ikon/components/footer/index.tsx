import KerossLogo from "./KerossLogo";

function Footer() {
  return (
    <footer className="flex border-t px-4 py-2 justify-center lg:justify-start">
      <div className="flex gap-2 items-center">
        <span>Powered By</span>
        <a href="https://keross.com" target="_blank">
          <KerossLogo />
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
