BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Building] (
    [BuildingID] INT NOT NULL IDENTITY(1,1),
    [BuildingName] NVARCHAR(100) NOT NULL,
    [Address] NVARCHAR(255) NOT NULL,
    CONSTRAINT [Building_pkey] PRIMARY KEY CLUSTERED ([BuildingID])
);

-- CreateTable
CREATE TABLE [dbo].[Room] (
    [RoomID] INT NOT NULL IDENTITY(1,1),
    [BuildingID] INT NOT NULL,
    [RoomNumber] NVARCHAR(20) NOT NULL,
    [Capacity] INT NOT NULL,
    [RoomType] NVARCHAR(50) NOT NULL,
    CONSTRAINT [Room_pkey] PRIMARY KEY CLUSTERED ([RoomID])
);

-- CreateTable
CREATE TABLE [dbo].[Student] (
    [StudentID] INT NOT NULL IDENTITY(1,1),
    [FirstName] NVARCHAR(50) NOT NULL,
    [LastName] NVARCHAR(50) NOT NULL,
    [DOB] DATE NOT NULL,
    [Gender] NVARCHAR(10) NOT NULL,
    [Phone] NVARCHAR(20) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    [Major] NVARCHAR(100) NOT NULL,
    [Year] INT NOT NULL,
    CONSTRAINT [Student_pkey] PRIMARY KEY CLUSTERED ([StudentID])
);

-- CreateTable
CREATE TABLE [dbo].[Contract] (
    [ContractID] INT NOT NULL IDENTITY(1,1),
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NOT NULL,
    [DepositAmount] DECIMAL(10,2) NOT NULL,
    [Status] NVARCHAR(20) NOT NULL,
    CONSTRAINT [Contract_pkey] PRIMARY KEY CLUSTERED ([ContractID])
);

-- CreateTable
CREATE TABLE [dbo].[RoomAssignment] (
    [AssignmentID] INT NOT NULL IDENTITY(1,1),
    [StudentID] INT NOT NULL,
    [RoomID] INT NOT NULL,
    [ContractID] INT NOT NULL,
    [MoveInDate] DATE NOT NULL,
    [MoveOutDate] DATE,
    CONSTRAINT [RoomAssignment_pkey] PRIMARY KEY CLUSTERED ([AssignmentID])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [PaymentID] INT NOT NULL IDENTITY(1,1),
    [ContractID] INT NOT NULL,
    [Amount] DECIMAL(10,2) NOT NULL,
    [PaymentDate] DATE NOT NULL,
    [PaymentType] NVARCHAR(50) NOT NULL,
    [Status] NVARCHAR(20) NOT NULL,
    [DueDate] DATE NOT NULL,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([PaymentID])
);

-- CreateTable
CREATE TABLE [dbo].[Staff] (
    [StaffID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(50) NOT NULL,
    [Phone] NVARCHAR(20) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    CONSTRAINT [Staff_pkey] PRIMARY KEY CLUSTERED ([StaffID])
);

-- CreateTable
CREATE TABLE [dbo].[MaintenanceRequest] (
    [RequestID] INT NOT NULL IDENTITY(1,1),
    [RoomID] INT NOT NULL,
    [StudentID] INT NOT NULL,
    [Description] NVARCHAR(1000) NOT NULL,
    [RequestDate] DATE NOT NULL,
    [Status] NVARCHAR(20) NOT NULL,
    [StaffID] INT NOT NULL,
    CONSTRAINT [MaintenanceRequest_pkey] PRIMARY KEY CLUSTERED ([RequestID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Room] ADD CONSTRAINT [Room_BuildingID_fkey] FOREIGN KEY ([BuildingID]) REFERENCES [dbo].[Building]([BuildingID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoomAssignment] ADD CONSTRAINT [RoomAssignment_StudentID_fkey] FOREIGN KEY ([StudentID]) REFERENCES [dbo].[Student]([StudentID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoomAssignment] ADD CONSTRAINT [RoomAssignment_RoomID_fkey] FOREIGN KEY ([RoomID]) REFERENCES [dbo].[Room]([RoomID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoomAssignment] ADD CONSTRAINT [RoomAssignment_ContractID_fkey] FOREIGN KEY ([ContractID]) REFERENCES [dbo].[Contract]([ContractID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_ContractID_fkey] FOREIGN KEY ([ContractID]) REFERENCES [dbo].[Contract]([ContractID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MaintenanceRequest] ADD CONSTRAINT [MaintenanceRequest_RoomID_fkey] FOREIGN KEY ([RoomID]) REFERENCES [dbo].[Room]([RoomID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MaintenanceRequest] ADD CONSTRAINT [MaintenanceRequest_StudentID_fkey] FOREIGN KEY ([StudentID]) REFERENCES [dbo].[Student]([StudentID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MaintenanceRequest] ADD CONSTRAINT [MaintenanceRequest_StaffID_fkey] FOREIGN KEY ([StaffID]) REFERENCES [dbo].[Staff]([StaffID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
