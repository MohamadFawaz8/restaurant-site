import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/70 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">M&amp;N</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Bottle-themed modern dining by Mohamad &amp; Noor.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/menu">
                Menu
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/reservations">
                Reservations
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/catering">
                Catering/Events
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions or special requests? Send a message via our contact page.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} M&amp;N (Mohamad &amp; Noor). All rights reserved.
      </div>
    </footer>
  );
}


