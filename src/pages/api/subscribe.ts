import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    // busca um usuário por e-mail
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      ) 
    )

    let customerId = user.data.stripe_customer_id // ID do Stripe e não do FaunaDB

    // verifica se o usuário do stripe existe
    if (!customerId) {                                
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })

      // atualiza uma informação no usuário
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'], // método de pagamento (cartão)
      billing_address_collection: 'required', // requerimento do endereço pessoal
      line_items: [ // descrição do produto (preço, quantidade)
        {
          price: process.env.STRIPE_PRICE_SIGNATURE, 
          quantity: 1
        }
      ],
      mode: 'subscription', // descreve se é um pagamento de uma única vez ou recorrente (recorrente)
      allow_promotion_codes: true, // possibilita uso de cupons de desconto
      success_url: process.env.STRIPE_SUCCESS_URL, // Ao aceitar é redirecionado
      cancel_url: process.env.STRIPE_CANCEL_URL // Ao recursar é redirecionado
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}