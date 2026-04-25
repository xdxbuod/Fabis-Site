export default async function handler(req, res) {
    // 1. Bloqueia qualquer tentativa de acesso que não seja POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // 2. Pega os dados do carrinho (handle e items) enviados pelo Frontend
        const payload = req.body;

        // 3. Faz a comunicação direta com a InfinitePay usando o endpoint público
        const response = await fetch("https://api.infinitepay.io/invoices/public/checkout/links", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // 4. Recebe a resposta (Link de pagamento gerado)
        const data = await response.json();

        if (!response.ok) {
            console.error("Erro retornado pela InfinitePay:", data);
            return res.status(response.status).json(data);
        }

        // 5. Devolve o link com sucesso para o Frontend
        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro interno no servidor da Vercel:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}