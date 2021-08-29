interface Feature {
  isEnabled(): boolean;
  setAcceptHTTPRequestContext(acceptHTTPRequestContext: boolean): Feature;
  isAcceptHTTPRequestContext(): boolean;
}

export default Feature;
