export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  newsletter: "Yes" | "No";
}

export interface BillingData {
  firstName: string;
  lastName: string;
  company: string;
  add1: string;
  add2: string;
  city: string;
  postcode: string;
}

export type TestResult = {
  title: string | undefined;
  status: string | undefined;
  screenshot?: string | undefined;
};
