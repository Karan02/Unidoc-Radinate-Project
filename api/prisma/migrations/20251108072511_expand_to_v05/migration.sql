-- CreateTable
CREATE TABLE "RBACUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RBACUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RBACRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RBACRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RBACPermission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "RBACPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RBACUser_email_key" ON "RBACUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RBACRole_name_key" ON "RBACRole"("name");

-- AddForeignKey
ALTER TABLE "RBACUser" ADD CONSTRAINT "RBACUser_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "RBACRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RBACPermission" ADD CONSTRAINT "RBACPermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "RBACRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
