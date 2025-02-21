from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

SHODAN_API_KEY = "YOUR_SHODAN_API_KEY"

@app.route("/run/search", methods=["POST"])
def search():
    try:
        data = request.get_json()
        query = data.get("value")
        query_type = data.get("type")  # "ip", "domain", "asn", "url"

        if not query:
            return jsonify({"error": "Search query is required"}), 400

        print(f"🔍 Searching {query_type}: {query}")

        # ✅ Construct the correct Shodan API URL based on query type
        if query_type == "ip":
            url = f"https://api.shodan.io/shodan/host/{query}?key={SHODAN_API_KEY}"
        elif query_type == "domain":
            url = f"https://api.shodan.io/dns/domain/{query}?key={SHODAN_API_KEY}"
        elif query_type == "asn":
            url = f"https://api.shodan.io/shodan/asn/{query}?key={SHODAN_API_KEY}"
        elif query_type == "url":
            url = f"https://api.shodan.io/shodan/scan/{query}?key={SHODAN_API_KEY}"
        else:
            return jsonify({"error": "Unsupported query type"}), 400

        # ✅ Fetch data from Shodan
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({"error": f"Shodan API error: {response.status_code}"}), response.status_code
        
        # ✅ If Shodan returns 401, return a proper error message
        if response.status_code == 401:
            return jsonify({"error": "Invalid Shodan API key or insufficient permissions"}), 401
        if response.status_code != 200:
            return jsonify({"error": f"Shodan API error: {response.status_code}"}), response.status_code


        shodan_data = response.json()
        print("📢 Full Shodan Response:", shodan_data)  # ✅ Debugging

         # ✅ Ensure `hostnames` is always present
        hostnames = shodan_data.get("hostnames", [])
        if not isinstance(hostnames, list):  # Ensure it's always a list
            hostnames = [hostnames]

        # ✅ Extracting fields safely to avoid `undefined` errors
        vulnerabilities = shodan_data.get("vulns", []) if "vulns" in shodan_data else []
        ports = shodan_data.get("ports", [])
        isp = shodan_data.get("isp", "Unknown")
        asn = shodan_data.get("asn", "Unknown")
        city = shodan_data.get("city", "Unknown")
        country = shodan_data.get("country_name", "Unknown")
        lat = shodan_data.get("latitude", None)
        lon = shodan_data.get("longitude", None)
        services = shodan_data.get("data", [])

        return jsonify({
            "type": query_type,
            "value": query,
            "hostnames": hostnames,
            "vulnerabilities": vulnerabilities,
            "open_ports": ports,
            "isp": isp,
            "asn": asn,
            "city": city,
            "country": country,
            "latitude": lat,
            "longitude": lon,
            "services": services
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Maltego Flask Server is Running on http://localhost:5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
