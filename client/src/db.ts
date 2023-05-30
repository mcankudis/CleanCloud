import { CloudFromAPI } from "./CloudFromAPI";

class CloudList {
  private clouds: CloudFromAPI[];

  constructor() {
    this.clouds = [];
  }

  setClouds(clouds: CloudFromAPI[]) {
    this.clouds = clouds;
  }

  getClouds(): CloudFromAPI[] {
    return this.clouds;
  }

  fromCookies() {
    const clouds = document.cookie.split(";");

    const tempClouds: CloudFromAPI[] = [];
    for (let i = 0; i < clouds.length; i++) {
      const cloud = clouds[i].split("=");
      if (cloud.length < 2) continue;
      const cloudObject = JSON.parse(cloud[1]);
      const tempCloud: CloudFromAPI = {
        _id: cloudObject._id,
        Standort: cloudObject.Standort,
        Name: cloudObject.Name,
        C02: cloudObject.C02,
        Provider: cloudObject.Provider,
        createdAt: cloudObject.createdAt,
        updatedAt: cloudObject.updatedAt,
        deletedAt: cloudObject.deletedAt,
      };
      tempClouds.push(tempCloud);
    }
    this.setClouds(tempClouds);
  }

  toCookies() {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    for (let i = 0; i < this.clouds.length; i++) {
      const cloud = this.clouds[i];
      document.cookie = cloud._id + "=" + JSON.stringify(cloud);
    }
  }
}

const cloudDB = new CloudList();
cloudDB.fromCookies();

export { cloudDB };
