import { auth } from "@/lib/auth";
import { getItem, queryItems } from "@/lib/dynamodb";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = (await getItem(`USERNAME#${username}`, "PROFILE")) as any;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">404</h1>
          <p className="text-gray-400">This page does not exist</p>
        </div>
      </div>
    );
  }

  const userId = profile.pk?.replace?.("USER#", "") || profile.userId;
  const links = (await queryItems(`USER#${userId}`, "LINK#")).map((l: any) => ({
    id: l.linkId || l.sk?.replace("LINK#", ""),
    title: l.title,
    url: l.url,
  })).filter((l) => l.title && l.url);

  const products = (await queryItems(`USER#${userId}`, "PRODUCT#")).map((p: any) => ({
    id: p.productId || p.sk?.replace("PRODUCT#", ""),
    name: p.name,
    price: p.price,
    currency: p.currency || "USD",
    image: p.image,
    url: p.url,
    featured: p.featured,
  })).filter((p) => p.name);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 9);
  const name = profile.name || username;
  const avatar = profile.image;

  const theme = (profile.theme || "minimal") as string;
  const themes: Record<string, { bg: string; card: string; text: string; accent: string }> = {
    minimal: { bg: "bg-white", card: "bg-gray-100", text: "text-gray-900", accent: "text-gray-600" },
    dark: { bg: "bg-gray-900", card: "bg-gray-800", text: "text-white", accent: "text-gray-400" },
    forest: { bg: "bg-green-50", card: "bg-green-100", text: "text-green-900", accent: "text-green-700" },
    ocean: { bg: "bg-blue-50", card: "bg-blue-100", text: "text-blue-900", accent: "text-blue-700" },
    sunset: { bg: "bg-orange-50", card: "bg-orange-100", text: "text-orange-900", accent: "text-orange-700" },
    lavender: { bg: "bg-purple-50", card: "bg-purple-100", text: "text-purple-900", accent: "text-purple-700" },
  };
  const t = themes[theme] || themes.minimal;

  return (
    <div className={`min-h-screen ${t.bg} flex flex-col items-center py-12 px-4`}>
      <div className="w-full max-w-md space-y-6">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
          />
        )}
        <h1 className={`text-2xl font-bold text-center ${t.text}`}>{name}</h1>
        {profile.bio && (
          <p className={`text-center text-sm ${t.accent}`}>{profile.bio}</p>
        )}

        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full ${t.card} ${t.text} rounded-xl px-5 py-3.5 text-center font-medium hover:opacity-80 transition-all shadow-sm`}
            >
              {link.title}
            </a>
          ))}
        </div>

        {featuredProducts.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h2 className={`text-sm font-semibold ${t.text} mb-3 text-center`}>Shop</h2>
            <div className="grid grid-cols-3 gap-2">
              {featuredProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${t.card} rounded-lg p-2 text-center hover:opacity-80 transition-opacity`}
                >
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-md mb-1" />
                  )}
                  <p className={`text-xs font-medium ${t.text} leading-tight`}>{product.name}</p>
                  <p className={`text-[10px] ${t.accent}`}>
                    {product.currency === "USD" ? "$" : product.currency === "EUR" ? "€" : product.currency === "GBP" ? "£" : product.currency + " "}
                    {product.price}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        <p className={`text-center text-xs ${t.accent} pt-4`}>LinkBio</p>
      </div>
    </div>
  );
}
