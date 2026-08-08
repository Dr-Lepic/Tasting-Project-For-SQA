const { uploadToCloudinary, deleteFromCloudinary } = require('../cloudinaryUpload');
const cloudinary = require('../../config/cloudinary');

jest.mock('../../config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('cloudinaryUpload Utility (TC-151 to TC-152)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadToCloudinary', () => {
    it('TC-151: should upload buffer stream and return secure_url', async () => {
      const mockUrl = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg';
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(null, { secure_url: mockUrl });
        return { pipe: jest.fn() };
      });

      const buffer = Buffer.from('fake image content');
      const url = await uploadToCloudinary(buffer, 'test-folder');

      expect(url).toBe(mockUrl);
    });

    it('should reject promise when Cloudinary upload stream errors', async () => {
      const mockError = new Error('Cloudinary Upload Failed');
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        callback(mockError, null);
        return { pipe: jest.fn() };
      });

      const buffer = Buffer.from('fake image content');
      await expect(uploadToCloudinary(buffer)).rejects.toThrow('Cloudinary Upload Failed');
    });
  });

  describe('deleteFromCloudinary', () => {
    it('TC-152: should extract publicId from URL and call destroy', async () => {
      const mockResult = { result: 'ok' };
      cloudinary.uploader.destroy.mockResolvedValue(mockResult);

      const imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1/leave-tracker/sample.jpg';
      const result = await deleteFromCloudinary(imageUrl);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('leave-tracker/sample');
      expect(result).toBe(mockResult);
    });
  });
});
