import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bioPageApi } from "../../api/services";

export default function PublicBioPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    bioPageApi.public(slug).then(({ data }) => setPage(data.page)).catch(() => {});
  }, [slug]);

  if (!page) return <div className="flex min-h-screen items-center justify-center bg-bgPrimary text-textMuted">Loading...</div>;

  return (
    <div className="min-h-screen bg-bgPrimary px-6 py-10 text-textPrimary">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-blueTone/20" />
        <h1 className="mt-5 font-display text-4xl font-bold">{page.title}</h1>
        <p className="mt-3 text-textMuted">{page.bio}</p>
        <div className="mt-8 space-y-4">
          {(page.links || []).sort((a, b) => a.order - b.order).map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => bioPageApi.trackClick(slug, link._id)}
              className="block rounded-2xl bg-blueTone px-5 py-4 font-medium text-white"
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
