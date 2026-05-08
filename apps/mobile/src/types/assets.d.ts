declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
