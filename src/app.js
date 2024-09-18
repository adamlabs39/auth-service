import express from "express";
import "dotenv/config";
// import { RoleModel, sequlizeInstance, UserModel } from "./models/model-synchronize.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import publicRoutes from "./routes/public-route.js";
import privateRoute from "./routes/private-route.js";
import redisClient from "./configurations/redis-client-config.js";
import requestResponseFormatterMidddleware from "./middlewares/request-response-formatter-middleware.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { sequelizeInstance, UserModel } from "@adameds-engineer/model-sdk";
import RoleModel from "./models/role-model.js";
import morgan from "morgan";
import cors from "cors";
const APPLICATION_PORT = process.env.APPLICATION_PORT;
const APPLICATION_HOST = process.env.APPLICATION_HOST;
const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors({ origin: "*", methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"] }))
app.use(express.urlencoded({ extended: true }));
app.use(requestResponseFormatterMidddleware);
app.use(publicRoutes);
app.use(privateRoute);
app.use(errorMiddleware);
redisClient.on("connect", () => console.log("Redis alredy accept request"));
app.listen(APPLICATION_PORT, APPLICATION_HOST, async () => {
  await redisClient.connect();
  await sequelizeInstance.sync({force: true, alter: false});
  console.log(sequelizeInstance.models);
  await sequelizeInstance.transaction(async (tr) => {
    const roleSuperAdmin = await RoleModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            name: "super admin"
          },
          {
            code: "SPR-ADM"
          }
        ]
      },
      defaults: {
        name: "super admin",
        code: "SPR-ADM",
        status: true
      },
      transaction: tr
    });
    await UserModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            email: "dontol@gmail.com"
          },
          {
            name: "dontol",
          }
        ]
      },
      defaults: {
        roleUuid: roleSuperAdmin[0].get().uuid,
        name: "Dontol maulana",
        phone: "081341079104",
        email: "admin@gmail.com",
        username: "dontol",
        permissions: [
          {
            "module": "Antrian",
            "sub_module": [
              {
                "name": "Konfigurasi",
                "allows": ["READ", "CREATE", "UPDATE", "DELETE"]
              },
              {
                "name": "Data Antrian",
                "allows": ["READ"]
              },
              {
                "name": "Layar",
                "allows": ["READ"]
              },
              {
                "name": "Apm",
                "allows": ["CREATE PATIEBT JKN", "CREATE PASIEN NON-JKN", "CHECKIN", "PRINT"]
              }
            ]
          },
          {
            "module": "Admisi",
            "sub_module": [
              {
                "name": "Antrian",
                "allows": ["PANGGIL", "LEWATI", "PROSSES", "SELESAI", "CHECKIN"]
              },
              {
                "name": "RJ",
                "allows": ["READ", "CREATE PASIEN RJ", "CREATE GENERAL CONSENT", "UPDATE ADMISI RJ", "UPDATE GENERAl CONSENT", "CETAk KUNJUNGAN", "CETAK LABEL", "BATAL RJ"]
              },
              {
                "name": "RI",
                "allows": ["READ", "CREATE BAYI BARU LAHIR", "CREATE PASIEN RI", "CREATE GENERAL CONSENT", "UPDATE ADMISI RI", "UPDATE GENERAL CONSENT", "BATAL REQUEST RI", "CETAK GENERAL CONSENT", "CETAK KUNJUNGAN", "CETAK LABEL"]
              },
              {
                "name": "IGD",
                "allows": ["CREATE PASIEN IGD", "CREATE GENERAL CONSENT", "UPDATE ADMISI IGD", "UPDATE GENERAL CONSENT", "BATAL IGD", "CETAK GENERAL CONSENT", "CETAK KUNJUNGAN", "CETAK LABEL"]
              },
              {
                "name": "SEP",
                "allows": ["READ", "CREATE SEP", "CREATE SEP MANUAL", "DELETE", "SIMPAN SEP MANUAL"]
              },
              {
                "name": "Data Pasien",
                "allows": ["READ", "CREATE PASIEN", "UPDATE BERKAS RM", "UPDATE DATA PASIEN", "DELETE PASIEN", "DELETE BERKAS RM", "IMPORT DATA PASIEN", "CETAK KARTU PASIEN", "UPLOAD BERKAS RM", "PREVIEW BERKAS RM"]
              },
              {
                "name": "Monitoring Kamar",
                "allows": ["READ", "CREATE BAD", "DELETE BAD", "SETTING BAD"]
              },
              {
                "name": "Laporan Admisi",
                "features": [
                  {
                    "name": "Kunjungan",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "penjamin",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Batal Kunjungan",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Status kamar",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Keperawatan Inap Pasien",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Bayi Baru Lahir",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Rekap Jumlah Pasien BPJS",
                    "allows": ["READ", "CETAK LAPORAN"]
                  }
                ]
              }
            ]
          },
          {
            "module": "Rawat Jalan",
            "sub_modules": [
              {
                "name": "Antrian", 
                "allows": ["PANGGIL", "LEWATI", "PROSSES", "SELESAI"]
              },
              {
                "name": "Poli",
                "allows": ["READ", "BATAL KUNJUNGAN"]
              },
              {
                "name": "BPJS-PCARE",
                "features": [
                  {
                    "name": "Monitoring Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  },
                  {
                    "name": "Monitoring Riwayat Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  },
                  {
                    "name": "Monitoring Obat Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  }
                  
                ]
              },
              {
                "name": "Laporan Rawat Jalan",
                "features": [
                  {
                    "name": "Pembatalan Poli",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "rekap Pembatalan Pasien",
                    "allows": ["READ", "CETAK LAPORAN"]
                  }
                ]
              },
            {
              "name": "RME",
              "features": [
                {
                  "name": "Rekap Medis",
                  "allows": ["READ", "UPDATE PEMERIKSAAN GIGI", "UPDATE PEMERIKSAAN MATA", "UPDATE PEMERIKSAAN FISIK", "UPDATE DERAJAT LUKA BAKAR", "UPDATE PEMERIKSAAN DAN TINDAKAN", "UPDATE REKAM MEDIS", "CETAK LABEL", "TUTUP SEMUA FORM", "BUKAN SEMUA FORM", "RIWAYAT", "SEMBUNYIKAN DETAIL PASIEN", "TAMPILKAN DETAIL PASIEN"]
                },
                {
                  "name": "Asemen",
                  "allows": ["READ", "CETAK LABEL", "RIWAYAT", "SEMBUNYIKAN DETAIL PASIEN", "CREATE DIAGNOSIS", "DELETE DIAGNOSIS", "UPDATE CATATAN PERAWAT", "BALAS CATATAN PERAWAT", "KIRIM CATATAN", "KIRIM INTRUKSI", "CREATE TINDAKAN", "CREATE MULTIPLE TINDAKAN", "DELETE TINDAKAN"]
                },
                {
                  "name": "SOAP",
                  "allows": ["READ", "CETAK LABEL", "RIWAYAT", "SEMBUNYIKAN DATA PASIEN", "TUTUP SEMUA FORM", "BUKA SEMUA FORM", "CREATE OBAT", "CREATE RACIKAN OBAT",  "ITEM OBAT RACIKAN", "UPDATE OBAT", "DELETE OBAT", "DELETE ITEM OBAT RACIKAN"]
                },
                {
                  "name": "Akses Dan Penunjang",
                  "allows": ["READ", "CREATE ALKES", "CREATE MULTIPLE ALKES", "DELETE LIST ALKES", "DELETE MULTIPLE ITEM ALKES", "DELETE SEMUA", "CREATE TINDAKAN", "DELETE LIST TINDAKAN"]
                },
                {
                  "name": "Inform Consent",
                  "allows": ["READ"]
                },
                {
                  "name": "Unggah Berkas",
                  "allows": ["READ", "UPDATE FILE", "DELETE FILE", ""]
                },
                {
                  "name": "Resume Dan Discarge",
                  "allows": ["READ"]
                },
                {
                  "name": "Cetak Hasil Dan Surat",
                  "allows": ["READ", "CREATE SURAT KETERANGAN", "DELETE SURAT KETERANGAN"]
                }
              ]
            }
            ]
          },
          {
            "module": "Rawat Inap",
            "sub_modules": [
              {
                "name": "Rawat Inap",
                "allows": ["READ"]
              },
              {
                "name": "Perpindahan Bangsal",
                "allows": ["READ", "BATAL TERIMA", "SETUJU DAN TERIMA"]
              },
              {
                "name": "BPJS-PCARE",
                "features": [
                  {
                    "name": "Monitoring Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  },
                  {
                    "name": "Monitoring Riwayat Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  },
                  {
                    "name": "Monitoring Obat Kunjungan",
                    "allows": ["READ", "CETAK BPJS"]
                  }
                ]
              },
              {
                "name": "Laporan",
                "features": [
                  {
                    "name": "Monitoring Rawat Inap",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Perpindahan Pasien",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Pembatalan Berobat",
                    "allows": ["READ", "CETAK LAPORAN"]
                  },
                  {
                    "name": "Rekap Tindakan Pasien",
                    "allows": ["READ", "CETAK LAPORAN"]
                  }
                ]
              },
              {
                "name": "Detail Pasien",
                "features": [
                  {
                    "name": "Rekam Medis",
                    "allows": ["READ", "UPDATE PEMERIKSAAN FISIK", "UPDATE DERAJAT LUKA BAKAR", "UPDATE PEMERIKSAAN DAN TINDAKAN", "UPDATE REKAM MEDIS", "DELETE SESI", ""]
                  },
                  {
                    "name": "Asesmen",
                    "allows": ["READ", "CREATE DIAGNOSIS", "DELETE DIAGNOSIS", "UPDATE CATATAN PERAWAT", "BALAS CATATAN PERAWAT", "KIRIM CATATAN PERAWAT", "KIRIM INTERUKSI MEDIS", "CREATE MULTIPLE TINDAKAN", "DELETE TINDAKAN", "DELETE MULTIPLE TINDAKAN", "DELETE SEMUA"]
                  },
                  {
                    "name": "SOAP Dokter",
                    "allows": ["READ", "CREATE OBAT", "CREATE RACIKAN", "UPDATE OBAT", "DELETE OBAT", "DELETE ITEM OBAT RACIKAN"]
                  },
                  {
                    "name": "Inform Consent",
                    "allows": ["READ"]
                  },
                  {
                    "name": "Inform Consent",
                    "allows": ["READ"]
                  },
                  {
                    "name": "Alkes Dan Penunjang", 
                    "allows": ["CREATE ALKES", "CREATE MULTIPLE ALKES", "DELETE ALKES", "DELETE MULTIPLE ALKES", "DELETE SEMUA", "CREATE TINDAKAN", "DELETE TINDAKAN"]
                  }
                ]
              }
            ]
          },
          {
            "module": "IGD",
            "sub_modules": []
          },
          {
            "module": "Farmasi",
            "sub_modules": []
          },
          {
            "module": "Lab",
            "sub_modules": []
          },
          {
            "module": "Fisioterapi",
            "sub_modules": []
          },
          {
            "module": "Training",
            "sub_modules": []
          },
          {
            "module": "Pembayaran",
            "sub_modules": []
          },
          {
            "module": "Stok",
            "sub_modules": []
          },
          {
            "module": "Inventory",
            "sub_modules": []
          },
          {
            "module": "Datamaster",
            "sub_modules": []
          },
          {
            "module": "Laporan",
            "sub_modules": []
          },
          {
            "module": "Setting",
            "sub_modules": []
          }
        ],
        password: await bcrypt.hash("admin123", 10),
        inventoryMedis: true,
        inventoryNonMedis: true,
        status: true,
      },
      transaction: tr
    });
  });
  console.log(`The server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});

export default app;