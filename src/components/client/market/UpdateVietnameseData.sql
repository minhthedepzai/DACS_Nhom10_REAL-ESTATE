-- Cập nhật dữ liệu tiếng Việt có dấu cho các bảng

-- Cập nhật bảng PropertyTypes
UPDATE PropertyTypes SET PropertyTypeName = N'Căn hộ/Chung cư' WHERE PropertyTypeID = 1;
UPDATE PropertyTypes SET PropertyTypeName = N'Biệt thự' WHERE PropertyTypeID = 2;
UPDATE PropertyTypes SET PropertyTypeName = N'Nhà riêng' WHERE PropertyTypeID = 3;
UPDATE PropertyTypes SET PropertyTypeName = N'Đất nền' WHERE PropertyTypeID = 4;
UPDATE PropertyTypes SET PropertyTypeName = N'Nhà phố' WHERE PropertyTypeID = 5;
UPDATE PropertyTypes SET PropertyTypeName = N'Văn phòng' WHERE PropertyTypeID = 6;
UPDATE PropertyTypes SET PropertyTypeName = N'Mặt bằng kinh doanh' WHERE PropertyTypeID = 7;

-- Cập nhật bảng RealEstateStatuses
UPDATE RealEstateStatuses SET StatusName = N'Đang chờ duyệt' WHERE StatusID = 1;
UPDATE RealEstateStatuses SET StatusName = N'Mới đăng' WHERE StatusID = 2;
UPDATE RealEstateStatuses SET StatusName = N'Đã bán/Đã cho thuê' WHERE StatusID = 3;
UPDATE RealEstateStatuses SET StatusName = N'Hết hạn' WHERE StatusID = 4;
UPDATE RealEstateStatuses SET StatusName = N'Bị từ chối' WHERE StatusID = 5;

-- Cập nhật bảng TransactionTypes
UPDATE TransactionTypes SET TransactionName = N'Cho thuê' WHERE TransactionTypeID = 1;
UPDATE TransactionTypes SET TransactionName = N'Bán' WHERE TransactionTypeID = 2;

-- Cập nhật bảng LegalStatuses
UPDATE LegalStatuses SET StatusName = N'Sổ hồng/Sổ đỏ' WHERE LegalStatusID = 1;
UPDATE LegalStatuses SET StatusName = N'Sổ đỏ riêng' WHERE LegalStatusID = 2;
UPDATE LegalStatuses SET StatusName = N'Hợp đồng mua bán' WHERE LegalStatusID = 3;
UPDATE LegalStatuses SET StatusName = N'Đang chờ sổ' WHERE LegalStatusID = 4;
UPDATE LegalStatuses SET StatusName = N'Giấy tờ khác' WHERE LegalStatusID = 5;

-- Cập nhật bảng Provinces
UPDATE Provinces SET ProvinceName = N'Thành phố Hồ Chí Minh' WHERE ProvinceID = 1;

-- Cập nhật bảng Districts
UPDATE Districts SET DistrictName = N'Quận 1' WHERE DistrictID = 1;
UPDATE Districts SET DistrictName = N'Quận 2' WHERE DistrictID = 2;
UPDATE Districts SET DistrictName = N'Thành phố Thủ Đức' WHERE DistrictID = 3;
UPDATE Districts SET DistrictName = N'Quận 4' WHERE DistrictID = 4;
UPDATE Districts SET DistrictName = N'Quận 5' WHERE DistrictID = 5;
UPDATE Districts SET DistrictName = N'Quận 6' WHERE DistrictID = 6;
UPDATE Districts SET DistrictName = N'Quận 7' WHERE DistrictID = 7;
UPDATE Districts SET DistrictName = N'Quận 8' WHERE DistrictID = 8;

-- Cập nhật bảng Wards
UPDATE Wards SET WardName = N'Phường Linh Trung' WHERE WardID = 1;
UPDATE Wards SET WardName = N'Phường Linh Xuân' WHERE WardID = 2;
UPDATE Wards SET WardName = N'Phường Nhơn Phú B' WHERE WardID = 3;
UPDATE Wards SET WardName = N'Phường Hiệp Bình Phước' WHERE WardID = 4;
UPDATE Wards SET WardName = N'Phường Tam Bình' WHERE WardID = 5; 