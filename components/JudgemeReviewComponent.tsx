import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type JudgeMeReviewWidgetProps = {
  shopDomain: string;
  publicToken: string;
  productHandle: string | string[];
  style?: object;
  height?: number;
};

function wrapWithJudgeMeAssets(widgetHtml: string): string {
  // You can also set viewport and minimal body style if you want!
    const replacedHtml =  widgetHtml.replace(
     ".jdgm-rev-widg{ display: none }",
     ".jdgm-rev-widg{ display: block !important }"
   );

  return`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body> 
           ${replacedHtml}
      </body>
    </html>
    `
  ;
}

async function fetchJudgeMeWidgetHtml(
  shopDomain: string,
  publicToken: string,
  productHandle: string | string[]
): Promise<string> {
  const url = `https://judge.me/api/v1/widgets/product_review?shop_domain=${shopDomain}&api_token=${publicToken}&handle=${productHandle}&per_page=10`;
  const res = await fetch(url);
  const data = await res.json();
  // "widget" key contains HTML string
  return wrapWithJudgeMeAssets(data.widget);
}

export default function JudgeMeReviewWidget({
  shopDomain,
  publicToken,
  productHandle,
  style,
  height = 500,
}: JudgeMeReviewWidgetProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchJudgeMeWidgetHtml(shopDomain, publicToken, productHandle)
      .then((widgetHtml) => {
        if (isMounted) {
          console.log('widget html', widgetHtml);
          setHtml(widgetHtml);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
    return () => {
      isMounted = false;
    };
  }, [shopDomain, publicToken, productHandle]);

  return (
    <View style={[{ height }, style]}>
      {loading && <ActivityIndicator />}
      {html && (
        <WebView
          originWhitelist={["*"]}
          source={{ html: html }}
          style={StyleSheet.absoluteFill}
          javaScriptEnabled
          domStorageEnabled
        />
      )}
    </View>
  );
}