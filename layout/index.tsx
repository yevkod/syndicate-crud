import Link from "next/link";

export const Layout = (props: any) => {
  return (
    <html lang="en">
      <div>
        <body>
          <Link href={`/home`}></Link>
          <Link href={`/register`}></Link>
          <Link href={`/login`}></Link>
        </body>
      </div>
    </html>
  );
};
