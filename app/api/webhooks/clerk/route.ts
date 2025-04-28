// import { verifyWebhook } from '@clerk/nextjs/webhooks'

// export async function POST(req: Request) {
//   try {
//     const evt = await verifyWebhook(req)

//     // Do something with payload
//     // For this guide, log payload to console
//     const { id } = evt.data
//     const eventType = evt.type
//     console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//     console.log('Webhook payload:', evt.data)

//     return new Response('Webhook received', { status: 200 })
//   } catch (err) {
//     console.error('Error verifying webhook:', err)
//     return new Response('Error verifying webhook', { status: 400 })
//   }
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { createUser } from "@/actions/user.action";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or environment variables');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

   // Read the request body
   const payload = await req.json();
   const body=JSON.stringify(payload);

    // Create a new instance of Svix Webhook for verification
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    // Verify the webhook signature and extract the event
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response('Webhook verification failed', { status: 400 });
  }

      const { id } = evt.data
      const eventType = evt.type
      //added
      // Example: Handle different event types
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username  } = evt.data;

    const user={
        clerkId:id,
        email: email_addresses[0]?.email_address,
        username:username!,
        photo:image_url,
        firstName:first_name,
        lastName:last_name,
    }

    console.log(user);
    const newUser= await createUser(user);
    // update metadata of clerk
    if(newUser){
        const clerk = await clerkClient(); // <-- first await the client
        await clerk.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
       })
    }
    
    return NextResponse.json({
        message:"New User created",
        user:newUser
    })
  }

      console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
      console.log('Webhook body:', body)
  
      return new Response('Webhook received', { status: 200 })

}