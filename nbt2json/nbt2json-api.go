package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/midnightfreddie/nbt2json"
)

const bindAddress string = "0.0.0.0"
const bindPort string = "8888"
const defaultOrigin string = "www.onlinetoolplanet.com"

// constant
var origins = []string{
	"127.0.0.1:8888",
}

func originInOrigins(origin string) bool {
	for _, s := range origins {
		if s == origin {
			return true
		}
	}
	return false
}

func setHeaders(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			if originInOrigins(origin) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			} else {
				w.Header().Set("Access-Control-Allow-Origin", defaultOrigin)
			}
		} else {
			w.Header().Set("Access-Control-Allow-Origin", defaultOrigin)
		}
		w.Header().Set("Access-Control-Allow-Origin", "www.onlinetoolplanet.com")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		handler.ServeHTTP(w, r)
	})
}

// TODO: eliminate code duplcation
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
		return
	case "HEAD":
		return
	default:
		http.Error(w, "Method "+r.Method+" not supported", 405)
		return
	}
}

// TODO: eliminate code duplcation
func json2NbtHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading body: "+err.Error(), 400)
			return
		}
		var outData []byte
		outData, err = nbt2json.Json2Nbt(body)
		if err != nil {
			http.Error(w, "Error decoding nbt: "+err.Error(), 400)
			return
		}
		w.Header().Set("Content-Disposition", "attachment; filename=json2nbt.bin")
		w.Header().Set("Content-Type", "octet-stream")
		w.Header().Set("Content-Length", strconv.FormatInt((int64)(len(outData)), 10))
		io.Copy(w, bytes.NewBuffer(outData))
		return
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
	mux.HandleFunc("/api/v1/nbt2json", nbt2jsonHandler)
	mux.HandleFunc("/api/v1/json2nbt", json2NbtHandler)
	log.Fatal(http.ListenAndServe(bindAddress+":"+bindPort, mux))
}
