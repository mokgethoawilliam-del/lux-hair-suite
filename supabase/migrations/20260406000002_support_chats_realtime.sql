-- Support Chat System
CREATE TABLE support_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    order_id UUID, -- Optional: link to a specific order
    session_id TEXT NOT NULL, -- To group guest messages without Auth
    message TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('customer', 'admin')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for support_chats
ALTER PUBLICATION supabase_realtime ADD TABLE support_chats;

-- Index for performance
CREATE INDEX idx_support_chats_session ON support_chats(session_id);
CREATE INDEX idx_support_chats_site ON support_chats(site_id);
