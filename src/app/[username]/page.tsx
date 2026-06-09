import { getItem, queryItems } from "@/lib/dynamodb";
import { currencies } from "@/lib/currencies";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const userRef = await getItem(`USERNAME#${username}`, "PROFILE");
  if (!userRef) notFound();

  const profile = await getItem(`USER#${userRef.userId}`, "PROFILE");
  if (!profile) notFound();

  const links = await queryItems(`USER#${userRef.userId}`, "LINK#");
  const activeLinks = links
    .filter((l: any) => l.isActive)
    .sort((a: any, b: any) => a.position - b.position);

  const products = await queryItems(`USER#${userRef.userId}`, "PRODUCT#");
  const featuredProducts = products
    .filter((p: any) => p.isFeatured)
    .sort((a: any, b: any) => a.position - b.position);

  let theme: any = {};
  try {
    theme = JSON.parse(profile.theme as string);
  } catch {
    theme = {
      background: "bg-gradient-to-br from-purple-500 to-pink-500",
      cardStyle: "rounded-2xl shadow-lg",
      textColor: "text-white",
      buttonStyle: "rounded-full",
      font: "font-sans",
    };
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return (
    <div className={`min-h-screen ${theme.background} ${theme.font} flex flex-col items-center px-4 py-12`}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
        {profile.image && (
          <img
            src={profile.image}
            alt={profile.name}
            className="w-20 h-20 rounded-full border-2 border-white/30 object-cover"
          />
        )}
        <h1 className={`text-xl font-bold ${theme.textColor}`}>{profile.name}</h1>
        {profile.bio && (
          <p className={`text-sm text-center opacity-80 ${theme.textColor}`}>{profile.bio}</p>
        )}

        {featuredProducts.length > 0 && (
          <div className="w-full">
            <h2 className={`text-sm font-semibold uppercase tracking-wider opacity-60 mb-3 ${theme.textColor}`}>
              Shop
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {featuredProducts.map((product: any) => (
                <div
                  key={product.productId}
                  className={`overflow-hidden ${theme.cardStyle} ${theme.cardBg || "bg-white/10 backdrop-blur-sm"} border ${theme.border || "border-white/20"}`}
                >
                  {product.imageUrl && (
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-1">
                    <h3 className={`font-semibold ${theme.textColor}`}>{product.title}</h3>
                    {product.description && (
                      <p className={`text-sm opacity-70 ${theme.textColor}`}>{product.description}</p>
                    )}
                    {product.price && (
                      <p className={`font-bold ${theme.textColor}`}>
                        {currencies.find((c: any) => c.code === (product.currency || "USD"))?.symbol || ""}
                        {product.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          {activeLinks.map((link: any) => (
            <a
              key={link.linkId}
              href={`${baseUrl}/api/track/${link.linkId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-full px-6 py-4 text-center font-medium transition-all
                hover:scale-[1.02] active:scale-[0.98]
                ${theme.cardStyle} ${theme.buttonStyle}
                ${theme.textColor}
                ${theme.cardBg || "bg-white/10 backdrop-blur-sm"}
                border ${theme.border || "border-white/20"}
              `}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
