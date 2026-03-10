import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageSelect, maxFiles = 3, maxSize = 5 }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate file count
    if (images.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate each file
    const validFiles = [];
    for (const file of files) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Only PNG, JPG, JPEG formats allowed');
        continue;
      }

      // Check file size (in MB)
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        continue;
      }

      validFiles.push(file);
    }

    const newImages = [...images, ...validFiles].slice(0, maxFiles);
    setImages(newImages);
    if (onImageSelect) {
      onImageSelect(newImages);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (onImageSelect) {
      onImageSelect(newImages);
    }
  };

  return (
    <div className="space-y-3">
      <label className="label flex items-center gap-2">
        <ImageIcon size={18} />
        Upload Evidence (Optional)
      </label>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {images.length < maxFiles && (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload images
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG up to {maxSize}MB (Max {maxFiles} files)
            </p>
          </div>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {(image.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          {images.length} of {maxFiles} images selected
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
