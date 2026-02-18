import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #F5C542 0%, #d4a837 100%)",
                    borderRadius: "36px",
                }}
            >
                <span
                    style={{
                        fontSize: "110px",
                        fontWeight: "bold",
                        color: "#0a0e17",
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    T
                </span>
            </div>
        ),
        { ...size }
    );
}
