package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/midnightfreddie/nbt2json"
)

const bindAddress string = "0.0.0.0"
const bindPort string = "8888"

func setHeaders(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "www.onlinetoolplanet.com")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		handler.ServeHTTP(w, r)
	})
}

func nbt2jsonHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading body: "+err.Error(), 400)
			return
		}
		var outData []byte
		outData, err = nbt2json.Nbt2Json(body, "https://wwww.onlinetoolplanet.com")
		if err != nil {
			http.Error(w, "Error decoding nbt: "+err.Error(), 400)
			return
		}
		fmt.Fprintln(w, string(outData[:]))
	case "HEAD":
		return
	default:
		http.Error(w, "Method "+r.Method+" not supported", 405)
		return
	}
}

func main() {
	// nbt2json.Nbt2Json()
	nbt2json.UseBedrockEncoding()
	nbt2json.UseLongAsString()
	mux := http.NewServeMux()
	http.Handle("/api/v1/nbt2json", setHeaders(mux))
	log.Fatal(http.ListenAndServe(bindAddress+":"+bindPort, nil))
}
