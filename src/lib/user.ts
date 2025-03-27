export async function getUserData() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/user`, {
      method: "GET",
      headers: { Authorization: `Bearer X9aP4qT7Lm2R` },
      cache: "no-store", //ensures fresh data in ssr
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
