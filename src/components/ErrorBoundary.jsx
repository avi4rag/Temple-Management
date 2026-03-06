import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-lg w-full border-destructive/30 shadow-lg bg-card">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                {this.props.title || "Something went wrong"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                {this.props.description ||
                  "An unexpected error occurred while loading this section of Divya Setu. The rest of the temple services remain operational."}
              </p>

              {this.state.error?.message && (
                <div className="p-3 bg-muted rounded text-xs font-mono text-left text-muted-foreground overflow-x-auto max-h-32 border">
                  {this.state.error.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  size="sm"
                  className="bg-gradient-sacred text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
