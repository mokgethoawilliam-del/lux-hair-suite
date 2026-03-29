export interface Product {
  id: string;
  name: string;
  category: "Frontal" | "Ponytail" | "Weave" | "Service";
  price: number;
  type: "In-Stock" | "Affiliate" | "Service";
  image_url: string;
  affiliate_link?: string;
  description?: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp_number: string;
  source: string;
  status: "New" | "Contacted";
  timestamp: string;
}

export interface SiteMetadata {
  key: string;
  value: string;
}
