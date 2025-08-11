import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import debounce from "../utils/debounce";
import authStore from "../store/authStore";
import AuthImagePattern from "../components/reuseable/AuthImageern";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, isRegistering, checkNickname } = authStore();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    nickname: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);

  const validateFields = () => {
    const errs = { name: "", nickname: "", email: "", password: "" };

    if (!formData.name.trim()) errs.name = "Name is required";

    if (!formData.nickname.trim()) {
      errs.nickname = "Nickname is required";
    } else if (isNicknameAvailable === false) {
      errs.nickname = "Nickname is taken";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errs.email = "Invalid email address";
    }

    if (!formData.password) {
      errs.password = "Password is required";
    } else {
      const pw = formData.password;
      if (pw.length < 8) errs.password = "Minimum 8 characters";
      else if (!/[a-z]/.test(pw)) errs.password = "Add lowercase letters";
      else if (!/[A-Z]/.test(pw)) errs.password = "Add uppercase letters";
      else if (!/[0-9]/.test(pw)) errs.password = "Add numbers";
      else if (!/[^A-Za-z0-9]/.test(pw))
        errs.password = "Add special characters";
    }

    return errs;
  };

  const debouncedCheck = useCallback(
    debounce(async (nickname) => {
      if (!nickname.trim()) return setIsNicknameAvailable(null);
      setCheckingNickname(true);
      const available = await checkNickname(nickname);
      setIsNicknameAvailable(available);
      setCheckingNickname(false);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedCheck(formData.nickname.trim());
  }, [formData.nickname, debouncedCheck]);

  const getPasswordStrength = () => {
    const pw = formData.password;
    let score = 0;
    if (!pw) return { score, label: "" };
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const label = ["", "Bad", "Bad", "Good", "Nice", "Strong"][score];
    return { score, label };
  };

  const { score: passwordScore, label: passwordLabel } = getPasswordStrength();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "nickname") setIsNicknameAvailable(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateFields();
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.values(validationErrors).some((err) => err)) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        nickname: true,
        email: true,
        password: true,
      });
      return;
    }

    const result = await signUp(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      "", // bio
      formData.nickname.trim()
    );

    if (result.success) {
      navigate("/VerifyAccount");
    } else {
      if (result.message.includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      }
      if (result.message.includes("nickname")) {
        setErrors((prev) => ({ ...prev, nickname: "Nickname already taken" }));
      }
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-white text-black lg:overflow-hidden  ">
      <div className="hidden lg:block">
        <AuthImagePattern
          title="Welcome !"
          subtitle="Sign up to explore and see amazing things in yarny."
        />
      </div>
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                <img src="./yarny.png" className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome to YARNY!</h1>
              <p>Create your account</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium ">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 " />
                </div>
                <input
                  type="text"
                  name="name"
                  className={`input input-bordered w-full pl-10 py-2 border-black focus:border-purple-500 ${
                    touched.name && errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            {/* Nickname */}
            <div>
              <label className="font-medium">Nickname</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className=" h-5 w-5" />
                </div>

                <input
                  type="text"
                  name="nickname"
                  placeholder="nickname"
                  className={`input input-bordered w-full pl-10 py-2 ${
                    touched.nickname && errors.nickname
                      ? "border-red-500"
                      : isNicknameAvailable === true
                      ? "border-green-500"
                      : ""
                  }`}
                  value={formData.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {checkingNickname && <p className="text-gray-400">Checking...</p>}
              {touched.nickname && errors.nickname && (
                <p className="text-sm text-red-500">{errors.nickname}</p>
              )}
              {isNicknameAvailable && !errors.nickname && (
                <p className="text-sm text-green-400">Nickname is available</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className=" h-5 w-5" />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10 py-3 ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className=" h-5 w-5" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 pr-10 py-2 ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <>
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className={`h-2 rounded ${
                        passwordScore <= 2
                          ? "bg-red-500"
                          : passwordScore === 3
                          ? "bg-yellow-400"
                          : passwordScore === 4
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${(passwordScore / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1 font-semibold text-gray-600">
                    {passwordLabel}
                  </p>
                </>
              )}
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={
                  isRegistering ||
                  isNicknameAvailable === false ||
                  Object.values(errors).some(Boolean)
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-purple-500 font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
