import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, User, Info, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTitleBar } from "@/hooks/useTitleBar";

const AddAccountPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { setConfig, resetConfig } = useTitleBar();

  useEffect(() => {
    setConfig({ showMinimize: false, showMaximize: false });
    return () => resetConfig();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) return;
    setPhase(2);
    setStatus("loading");

    try {
      const requestBody = `{"email":"${username}","mobile":"","password":"${password}","area_code":"","device_id":"DeyJhcHBJZCI6ImRlZmF1bHQiLCJvcmdhbml6YXRpb24iOiJQOXVzQ1VCYXV4ZnQ4ZUFtVVhhWiIsImVwIjoiRFVNV29VYjFUV0M5RkkzOXpXdzdDaDl2b3FVVHVPSjFBbkRIWDlDTjUvSkNxOXJHTkpDdEt4TGp4TWNtcGErYXlpNW10Q0poTjlRRDZPcFRqNytCbHZFb2tremhyRE1zQ1JqYkV3bzVkRkdmWHBLUGlTczE5Z2pqU0Y4V1pmdlB4bXpGOUVIdmxraERpMnVRc2RuNzQvVXFlR0VwMlNXZ0lueHBDU2p0TXdzPSIsImRhdGEiOiI2NTI2NDQxZmNhM2QxOTE5MTExNzRhMmYwYzgwMzJjZjQ2NzQzOWU1Nzc4YWY5ZDhlMzEzOGYxOWViYWNjYzUzMjc4OTRmZWUxYjkxZmI0OTg3NzQ5MGZjZTcyZTgyMTkyOTA5Mjk4NzBmODYwODE1NjZhOGVlOTAzZWQ1NmJiNGRmMjBkMzgyZWVjNTZjNzE3M2I5YzVjZTAzZjViNzY2MzJkMzU0NzlmNzI3MDVmMTRmMWVjZWVjNGE0Nzc1OGZjZDEwMDJmYTc0ZmVlZWZkYTBkZmUxYmNhNTIxNGM5ZGUzNjkwMDRmZDgyYzBiNGUzZTNhYjMwMDAyN2Y4NjA5YzU2YmZhNTQ3OTVmZDQwZTBkZjczZGMyZDMwMzE0MzMzZGEyNzU1N2Y5ZGMzODNiMzhmZmNmM2ZlNTcyNzhjYmYxNGY5N2ZhMWVlNGI0MjZkMDA2NGRmNTg2ZjM4NjcwZDlmMjQzY2I1ZDk3NmM5YWIxMjg0OTVjYmFiMTYwMTBjZmJhNTM1N2E5OWE5OTRkZTk3ZTAyNjc3MGI4YWY3ZTliOTFlZTBiOTBmZmY1MzUzNjVmNmJlZmMxMDM5MDAwMDc0NTQwNmYyNTI5MDNkMzJmYzNlYjgyNzkwMTAzYmU4N2E2NWQyMjExZWIxMDVlNzk3MGIxNmU4OWM4MWU1NDc2MjA3NzY2MTg4YTRmZTE3ZmI5ZThjMWIyZDQ0NmU0NmY1OTQ4N2QzODJjMDRkZjgxZjI2MmIyMTc3NjQzNGM4NDU1MDZhOWZjMzc2Mzc0YjFmMmU2OTBlMWNjMTFmMjUzYTNkMWU5NTg3MjJkMmVjOTlmOWRmNzQ0ODRmMjdiNjU3MjVlNjYwMTZlMWJhMjUyMjRhNzE2NTc3ZGI3NjQ3Yjk1ZmU2YTE3NTk0YTU4MjFlNmJjOTRlYmUzYjdiYjQxY2ZhMzU1MzE4MmRhYmI0MTE0NTI4YjZiYmY5YzRlMDU4ZTFlOTJkYmY4ODgyMGQxODk4YWNhYjBkYTMwNzk0NGJkMjE1YzZmYWNlMzk1MGYxNWU3ZjEwNzkxNTZmODFhNGNkMjkyMzZlY2ZkZGNmZTgyYTMzZWNhYjcwZDM5OWU5MDQwODcxNjY0OGZjOWZjODJkY2JlZDAxYWJiZWFmNjY1MWY1NjIzNTUzYzkyMjQxNzBjM2U2OWU1NzE2Y2JmOGY0NjZmMjBmNWE2NjBmYjk2YzI0NDIzYWY5NjFlZmY3N2RmZmYxMTU0YmFlNjhlMjg0YjcyZjFiZmRjNmI1MzUyMTcwZWUxOWMxNmM2YTIwZmI1MzQwYzJmYzU3NTdhYmFiZDk2ODhlZDczMTRlYjJjNmZhNjFiZTk0YTk1YmI0MjZmNzg0M2M1MGIzNzAxMzU3YTMxYzg1NjlmZWJhNzU3MDU4ZmMzZTRiOGJmMzUyMjA3OTI0NDRjMjhkOTE0YTQ3YWZiMTJlZWQ5ZGQ3ZDhhYjNiNjExYmNkNzYzYzZlM2VhOWQwZDA0MWY5OGY4NjYxMDMxMTIyZmE4NDNhZGU2NmEzMWNiNDA5NTQwNzI1MjYzNTAyYzAyODIwODA1ODBjMjJmM2M1YjkwNWI1YTdhZjhmZDZlYWM2YTE3MjE3ZjIyNmExZWNmY2FiMmZhNjhhY2EwNzA4NjExMWNkNWZhNWNhODk3MjhmMmQ1NDczNmNhMWI5YzZkOTMwNjY4MmMwMTgxZWQ0ZmRmZTI0ZTVkOGIxYTNjYjY0NzYwYjM5ZjUwMTMxOGUyMGQ3M2Y4OWFjMTYwN2Q5YjJjZjQwMmQ0ZmI0YjNkYzRmOGZhMjNiOTg4NWU2N2MwMzA1N2YzMzVmM2I0ODQ0ZDkxYWJjNDlhMTRkOTM2ODhkNmViODg3OGUyYzNhMzI2MjIxMDU0OTNjYmE5OGU2MGEwOTcwZGI3YzIxNDQ4ZDllZWM5YzJkNmZkMWU0MzU3ZGU1ZTJmZWNhOTk2ZWI3MGYzYmM2MzFiMjdhNmJmY2I3NGUxNTNhYzE2Y2Y3OGFiNzAzYTBjMjRjYmFjYjM4ODJkOTVmMTI5ZDlmMWMxN2EwZGUzMjJiM2UwNTNkZjE3NmNjM2NlOTEyY2UwMTRjNWE4MWVhZDcxMTY1ZjRmMTgxMGMxMjZiN2VmYWM4NjU5Y2FmYjE3OWE1MmY0N2JmZDdjZGQzMzVkZDY0MDA5ZWFlZTQ2MDRkNmFlZDE0MjVjZjQxNjE2ZTliNjcxMmNjMjZkMmM1Mjg2Mzc1ZDA0YjQxZTZiNDNkMzdiMWI0MjI3ZmI3YjRmMmQyZTJhNmEyNjhmOWIxYmI2YmE0MDA2ZWIzNzQ0OGRlMWYyZDUyNzBjYWEzYzYzMzhlNzFjM2FjZmU1ZTFhOTA1YjBhMjJjMWEyNzc3NzE0YWExZDlmODFlNzJlNDM4ZTQzZTAxMjNiNTg4MDFhMzVlYmVjNzBjMTI5Y2FkODgzMjE5MWNkNjFjNzM0YjgyMzgzNTEyZmYyODIzNDRkMWMyODUwMTE0NGE3YjcwMmRkNDU3ODk4NDQ2ZTk0YzYxNTUwNjQ3Y2FmYTkyZDg1OGNjYmU1ZDljZWIwMjc2MzQ2ZTEwYmEyNTJiZWRhNGY2MDExN2FmNDEyZmZhOTRiZDNiMGM2MWU5NjVlZGRlMjMxYTVkN2MzNjU5MjUyMDk3MmJmNmRkOWYyZWI3ZTA2MjgzY2FhODk1ZDZlMjAyNzhlMzc1YTY1Nzg1MTk2NjBjOTVhZmM5M2RjNzJlNTEzNDUzOGQ5YjczYmM5NWRmZWMwOThiOGY3ZWQ2MjIyZDFmZDcyNmYxYmQ4ZjA0NDM2Yzg5MTUwZTk4ZDZkZTNhMjc2NDNiM2I1YzYzYjFhYjkxZWNhMWI1NDNlYTQ3OTBkNTEzMTgxMTIyZjkxMDkzZjMyNDFjZDE4Y2JmMDFkODJhZjE0YWU4YTllMzIyYzBkYzEwZDIyNDAzZjE0NTcwMTdlZWQ5OWI5MmNlZmVjYzRhOTU5YTQ3YzA1MjA3M2U4NjFlYTM5ZDE3YjE0ZjhlMDUyZmEzNjNiMDVhNGIzOWQxYTNmNDdkNDViMzZmODBmYTQ4OTMwZTZkYjdmZTUyZTg5MmNlMjg0OTg3YmRlMTg1NWU2ZjI0MDE0OTgzMDRlMjlkZTY0MzNiZWRiMjg1YTI1NDMxNWFhY2Y0ZTUxNzdhN2UyODc1NjM3ZDRhNzk4OWQxM2MzZDRhMDFkMWQxMmI5MzNmZTIwYTRjZWYzZDJhNTM4ZTVlNzM1ZDM3NmYzNGJkY2M5MzRiZDBiZDBiNTc3OWRhZmQ4NjEyMDMzN2FlNGZjZTg1YmIyMTI4ZjYzNjFlNzdlNjkwM2Y0YWNhNmNhOWU2ZWViYWM1MzY2ZmE0ZjgyYjBiYTg5OWQyYjBkNDU1ZTg3ZmQ4ZmY1ZDk5ODI2N2E5MzE5YWY4MmI1MmY4MWNiNGYxMmVmOTYwYjE3M2RmYWNmMGZkZDA0OTgzN2Q0ZDJiODM1NWVlMDhhODgxNGM2MDQ5NDU0ODhjMWQ5OGJiZDRhYWI0MDdmOGI5MTIyZjFlYzVlOWVkNzk5YWU3OTVjMGRlODExNTQwMGNhZGJhMjQ4ZTJkOTllOGQ0YWFlZDM0MjVjZWYzNTVkYTU4NWI0ZTg1YzAxM2JiMjU3NDFlZTE1NjdlY2Q0OWU1Zjc3NThiMzYyYWE5YjQxYjc5ZmRiNDEyYTBkMzBlODI0NDhhNWFiOWZiZDQ1MjNjODhmNTE4NWFkYzhjZWNlZGIyMTBlY2VjZWJhZGYwZmYwMWUzMGY4MzNkZTk5NTNmYmNiNTFmNDg4ZDEyZmRkNDhhYTcyZTliOTNmZjA5OTIyNzM0MzQ4NjU2Zjg3OTE5ZDJiMTU4ZTQ4ZmJmZWFjNjVjMzJkYmY4MjUyOTE3MDc3NjQwMjNiZGY3NDkxZTAyMGVlMWYxMTUxNDVmZmFkMTlmM2M4ODY0YTMxYzJhODZiMGMxOTJlNDliOWQxN2E3NTBkZDY4MWM5MzcxNmE2OSIsIm9zIjoid2ViIiwiZW5jb2RlIjo1LCJjb21wcmVzcyI6Mn0=","os":"web"}`;

      const response = await axios.post("https://chat.deepseek.com/api/v0/users/login", requestBody, {
        headers: {
          "accept": "*/*",
          "accept-language": "vi",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-app-version": "2.0.0",
          "x-client-locale": "vi",
          "x-client-platform": "web",
          "x-client-timezone-offset": "25200",
          "x-client-version": "2.0.0",
          "cookie": "ds_session_id=e9d3eeddd9fc4b12af7709f156ab0d70; aws-waf-token=509f097b-ac5f-48c3-9132-ba56a17e2893:BgoAiMKc2HgHAAAA:sketrjQktK3+m1oqMMnfzSAMk70hT0qYYh8ufpn5zWiZgEm+6CYJpz65Q6zB5FC8Yr214RWW50dsBxag9wOXWXThJuSaxw0duVtFFJ7wr8daYDTUuyNtb11uLnu0VnIkX8hUP9/k67Ud8tuGj855rsmArhcoHG74iLRGg8CU7EGNLjIgqO8d8H+kLrZLf3c=; .thumbcache_6b2e5483f9d858d7c661c5e276b6a6ae=; smidV2=20260512052204d663f8b0941fc5ec91bf38d7102b615e00d674b9357a11a20",
          "Referer": "https://chat.deepseek.com/sign_in"
        }
      });

      if (response.data && response.data.code === 0 && response.data.data?.biz_code === 0) {
        const user = response.data.data.biz_data.user;
        const res = await window.electron?.db.addAccount({
          id: user.id,
          email: user.email,
          token: user.token
        });
        
        if (res?.success) {
          setStatus("success");
          setTimeout(() => {
            window.electron?.windowControls.close();
          }, 1500);
        } else {
          setStatus("error");
          setErrorMessage("Lỗi khi lưu tài khoản vào cơ sở dữ liệu.");
        }
      } else {
        setStatus("error");
        setErrorMessage(response.data?.data?.biz_msg || response.data?.msg || "Đăng nhập thất bại.");
      }
    } catch (err: unknown) {
      setStatus("error");
      const error = err as any;
      setErrorMessage(error.response?.data?.msg || error.message || "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-none border-none bg-transparent">
        {phase === 1 && (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Thêm tài khoản DeepSeek</CardTitle>
              <CardDescription>
                Nhập thông tin tài khoản và mật khẩu để bắt đầu sử dụng ShallowSeek.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tài khoản</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    placeholder="Nhập tên tài khoản..." 
                    className="pl-9" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu..." 
                    className="pl-9 pr-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Mật khẩu của bạn được lưu trữ an toàn trên máy tính này.
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" onClick={handleLogin} disabled={!username || !password}>
                Tiếp tục
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => window.electron?.windowControls.close()}>
                Hủy bỏ
              </Button>
            </CardFooter>
          </>
        )}

        {phase === 2 && (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Đang kiểm tra...</h3>
                  <p className="text-sm text-muted-foreground mt-1">Vui lòng chờ trong giây lát</p>
                </div>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500" />
                <div className="text-center">
                  <h3 className="text-lg font-medium text-green-500">Đăng nhập thành công!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Đã lưu tài khoản của bạn.</p>
                </div>
              </>
            )}
            
            {status === "error" && (
              <>
                <XCircle className="w-12 h-12 text-destructive" />
                <div className="text-center">
                  <h3 className="text-lg font-medium text-destructive">Đăng nhập thất bại</h3>
                  <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setPhase(1)}>
                  Thử lại
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddAccountPage;
