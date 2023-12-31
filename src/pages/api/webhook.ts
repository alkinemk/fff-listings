const rpc = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`;

const getAsset = async (token: string) => {
  const response = await fetch(rpc, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: token,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const webhook: any = process.env.DISCORD_WEBHOOK;

      let webhook_data = req.body;

      let token: any = await getAsset(webhook_data[0].events.nft.nfts[0].mint);

      console.log("title", token.content.metadata.name);
      console.log("attributes", token.content.metadata.attributes);

      let isAtLeastTierOneHead = token.content.metadata.attributes.some(
        (attribute: any) =>
          attribute.trait_type === "Head Tier" && attribute.value >= 1
      );

      let isAtLeastTierOneOutfit = token.content.metadata.attributes.some(
        (attribute: any) =>
          attribute.trait_type === "Outfit Tier" && attribute.value >= 1
      );

      let isAtLeastTierOne = isAtLeastTierOneHead && isAtLeastTierOneOutfit;

      const hasGoodEyes = token.content.metadata.attributes.some(
        (attribute: any) =>
          attribute.trait_type === "Eyes" &&
          (attribute.value === "Mutated" ||
            attribute.value === "Sleepy" ||
            attribute.value === "Shades" ||
            attribute.value === "Scar" ||
            attribute.value === "Eye Patch" ||
            attribute.value === "Thug" ||
            attribute.value === "Synth" ||
            attribute.value === "Solana" ||
            attribute.value === "Spectacles")
      );

      const hasGoodMouth = token.content.metadata.attributes.some(
        (attribute: any) =>
          (attribute.trait_type === "Mouth" && attribute.value === "Stache") ||
          attribute.value === "Beard" ||
          attribute.value === "Fangs"
      );

      const hasUniqueRoom = token.content.metadata.attributes.some(
        (attribute: any) =>
          attribute.value === "Orange Origins" ||
          attribute.value === "Galactic Geckos" ||
          attribute.value === "DeGods" ||
          attribute.value === "Trading Room" ||
          attribute.value === "Gargolon" ||
          attribute.value === "NFTgfx" ||
          attribute.value === "Grim Syndicate" ||
          attribute.value === "Solsteads" ||
          attribute.value === "Monkettes" ||
          attribute.value === "Bitmon" ||
          attribute.value === "BAPE" ||
          attribute.value === "Sea Shanties" ||
          attribute.value === "Igloo" ||
          attribute.value === "Degen DAOO" ||
          attribute.value === "Gym" ||
          attribute.value === "Poker" ||
          attribute.value === "Jambo Mambo" ||
          attribute.value === "Portals" ||
          attribute.value === "MonkeDAO" ||
          attribute.value === "Solana Storm" ||
          attribute.value === "Gooney Tunes"
      );

      let is4T = hasGoodEyes && hasGoodMouth;

      let listing_price = (
        webhook_data[0].events.nft.amount / 1000000000
      ).toFixed(2);

      if (hasUniqueRoom) {
        const response = await fetch(webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: null,
            embeds: [
              {
                title: token.content.metadata.name + " listed!",
                url: `https://www.tensor.trade/item/${webhook_data[0].events.nft.nfts[0].mint}`,
                color: 16486972,
                fields: [
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: ":moneybag:  Listing Price",
                    value: "**" + listing_price + " " + "SOL**",
                    inline: true,
                  },
                  {
                    name: ":date:  Listing Date",
                    value: `<t:${webhook_data[0].timestamp}:R>`,
                    inline: true,
                  },
                  {
                    name: "Room unique?",
                    value: hasUniqueRoom,
                    inline: true,
                  },
                ],
                image: {
                  url: token.content.files[0].uri,
                },
                timestamp: new Date().toISOString(),
                footer: {
                  text: "Helius",
                  icon_url:
                    "https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png",
                },
              },
            ],
          }),
        });
        console.log(response);
      } else {
        const response = await fetch(webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: null,
            embeds: [
              {
                title: token.content.metadata.name + " listed!",
                url: `https://www.tensor.trade/item/${webhook_data[0].events.nft.nfts[0].mint}`,
                color: 16486972,
                fields: [
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: ":moneybag:  Listing Price",
                    value: "**" + listing_price + " " + "SOL**",
                    inline: true,
                  },
                  {
                    name: ":date:  Listing Date",
                    value: `<t:${webhook_data[0].timestamp}:R>`,
                    inline: true,
                  },
                  {
                    name: " ",
                    value: " ",
                  },
                  {
                    name: "4 attributs?",
                    value: is4T,
                    inline: true,
                  },
                  {
                    name: "tier 1 ou +?",
                    value: isAtLeastTierOne,
                    inline: true,
                  },
                ],
                image: {
                  url: token.content.files[0].uri,
                },
                timestamp: new Date().toISOString(),
                footer: {
                  text: "Helius",
                  icon_url:
                    "https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png",
                },
              },
            ],
          }),
        });
        console.log(response);
      }

      res.status(200).json("success");
    }
  } catch (err) {
    console.log(err);
  }
}
