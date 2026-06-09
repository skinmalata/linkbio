import { getItem, queryItems } from "@/lib/dynamodb";

interface Props {
  params: Promise<{ username: string }>;
}

const themes = {
  minimal: {
    bg: "bg-gradient-to-b from-white to-gray-50",
    card: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
    text: "text-white",
    accent: "text-gray-500",
    name: "text-gray-900",
    bio: "text-gray-500",
    badge: "bg-gray-100 text-gray-500",
  },
  dark: {
    bg: "bg-gradient-to-b from-gray-900 to-gray-950",
    card: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]",
    text: "text-white",
    accent: "text-gray-400",
    name: "text-white",
    bio: "text-gray-400",
    badge: "bg-gray-700 text-gray-300",
  },
  forest: {
    bg: "bg-gradient-to-b from-green-900 to-emerald-950",
    card: "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-900 shadow-md hover:shadow-amber-500/30 hover:scale-[1.02]",
    text: "text-stone-900",
    accent: "text-green-300",
    name: "text-white",
    bio: "text-green-200",
    badge: "bg-green-700/60 text-green-200",
  },
  ocean: {
    bg: "bg-gradient-to-b from-blue-900 to-indigo-950",
    card: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md hover:shadow-cyan-500/30 hover:scale-[1.02]",
    text: "text-white",
    accent: "text-blue-300",
    name: "text-white",
    bio: "text-blue-200",
    badge: "bg-blue-700/50 text-blue-200",
  },
  sunset: {
    bg: "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600",
    card: "bg-white text-gray-900 shadow-lg hover:shadow-xl hover:scale-[1.02]",
    text: "text-gray-900",
    accent: "text-gray-600",
    name: "text-white",
    bio: "text-white/80",
    badge: "bg-white/20 text-white",
  },
  lavender: {
    bg: "bg-gradient-to-b from-purple-100 via-fuchsia-50 to-pink-100",
    card: "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
    text: "text-white",
    accent: "text-purple-600",
    name: "text-purple-900",
    bio: "text-purple-600",
    badge: "bg-purple-100 text-purple-600",
  },
};

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const userRef = await getItem(`USERNAME#${username}`, "PROFILE") as any;
  if (!userRef) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">404</h1>
          <p className="text-gray-400">This page does not exist</p>
        </div>
      </div>
    );
  }

  const userId = userRef.userId;
  const profile = await getItem(`USER#${userId}`, "PROFILE") as any;

  const links = (await queryItems(`USER#${userId}`, "LINK#"))
    .map((l: any) => ({
      id: l.SK?.replace("LINK#", ""),
      title: l.title,
      url: l.url,
    }))
    .filter((l) => l.title && l.url);

  const products = (await queryItems(`USER#${userId}`, "PRODUCT#"))
    .map((p: any) => ({
      id: p.SK?.replace("PRODUCT#", ""),
      name: p.title,
      price: p.price,
      currency: p.currency || "USD",
      image: p.imageUrl,
      url: p.url,
      featured: p.isFeatured,
    }))
    .filter((p) => p.name);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 9);
  const name = profile?.name || username;
  const avatar = profile?.image;
  const bio = profile?.bio;
  let rawTheme = (profile?.theme || "minimal") as string;
  if (rawTheme.startsWith("{")) rawTheme = "minimal";
  const themeName = (["minimal", "dark", "forest", "ocean", "sunset", "lavender"].includes(rawTheme) ? rawTheme : "minimal") as keyof typeof themes;
  const t = themes[themeName];

  const formatPrice = (price: string, currency: string) => {
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", NGN: "₦" };
    return `${symbols[currency] || currency + " "}${price}`;
  };

  return (
    <div className={`min-h-screen ${t.bg} flex flex-col items-center py-16 px-4`}>
      <div className="w-full max-w-md space-y-6">
        {avatar && (
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className={`w-28 h-28 rounded-full mx-auto object-cover shadow-xl ${
                  (themeName === "minimal" || themeName === "lavender")
                    ? "ring-4 ring-gray-200"
                    : "ring-4 ring-white/40"
                }`}
              />
            </div>
          </div>
        )}

        <div className="text-center space-y-1">
          <h1 className={`text-2xl font-bold ${t.name}`}>{name}</h1>
          {bio && <p className={`text-sm ${t.bio}`}>{bio}</p>}
        </div>

        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full ${t.card} rounded-2xl px-6 py-4 text-center font-medium transition-all duration-200`}
            >
              {link.title}
            </a>
          ))}
        </div>

        {featuredProducts.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center gap-2 justify-center mb-4">
              <span className={`text-xs font-semibold uppercase tracking-wider ${t.accent}`}>Shop</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {featuredProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${t.card} rounded-xl p-3 text-center transition-all duration-200`}
                >
                  {product.image ? (
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-black/10">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-full aspect-square rounded-lg mb-2 flex items-center justify-center ${t.badge} text-xs`}>
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <p className={`text-xs font-medium ${t.text} leading-tight line-clamp-2`}>{product.name}</p>
                  <p className={`text-[11px] ${t.accent} mt-0.5`}>{formatPrice(product.price, product.currency)}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        <p className={`text-center text-xs ${t.accent} pt-6 opacity-50`}>LinkBio</p>
      </div>
    </div>
  );
}
