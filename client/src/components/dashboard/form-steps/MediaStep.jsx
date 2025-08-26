import { useState, useRef } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentIcon,
  XMarkIcon,
  EyeIcon,
  StarIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const MediaStep = ({ formData, errors, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);

  // Safe media object
  const safeMedia = {
    images: [],
    videos: [],
    documents: [],
    virtualTour: '',
    ...formData.media
  };

  const handleChange = (field, value) => {
    onChange({
      media: {
        ...safeMedia,
        [field]: value
      }
    });
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files, 'images');
    }
  };

  // File handling
  const handleFiles = async (files, type = 'images') => {
    const validFiles = files.filter(file => {
      if (type === 'images') {
        return file.type.startsWith('image/');
      } else if (type === 'videos') {
        return file.type.startsWith('video/');
      } else if (type === 'documents') {
        return file.type === 'application/pdf' || 
               file.type.startsWith('application/') ||
               file.type.startsWith('text/');
      }
      return false;
    });

    if (validFiles.length === 0) {
      alert(`No valid ${type} files selected`);
      return;
    }

    // Simulate file upload (replace with actual upload logic)
    for (const file of validFiles) {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      const uploadSimulation = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(uploadSimulation);
            
            // Add file to media array
            const newFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file), // In production, this would be the uploaded file URL
              file: file, // Keep reference for actual upload
              isPrimary: type === 'images' && safeMedia.images.length === 0
            };

            handleChange(type, [...safeMedia[type], newFile]);
            
            // Remove from progress tracking
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
            
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 100);
    }
  };

  const removeFile = (type, index) => {
    const updatedFiles = safeMedia[type].filter((_, i) => i !== index);
    handleChange(type, updatedFiles);
  };

  const setPrimaryImage = (index) => {
    const updatedImages = safeMedia.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    handleChange('images', updatedImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <PhotoIcon className="h-6 w-6 mr-2 text-primary-500" />
          Media & Documentation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload photos, videos, and documents to showcase your {isRealEstate ? 'property' : 'product'}.
        </p>
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <PhotoIcon className="h-5 w-5 mr-2" />
            Photos *
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {safeMedia.images.length}/20 images
          </span>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(Array.from(e.target.files), 'images')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                PNG, JPG, JPEG up to 10MB each. Maximum 20 images.
              </p>
            </div>
          </div>
        </div>

        {errors['media.images'] && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            {errors['media.images']}
          </p>
        )}

        {/* Image Grid */}
        {safeMedia.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {safeMedia.images.map((image, index) => (
              <div key={image.id || index} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className={`p-2 rounded-full ${
                        image.isPrimary
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-yellow-500 hover:text-white'
                      }`}
                      title={image.isPrimary ? 'Primary image' : 'Set as primary'}
                    >
                      <StarIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                      title="View full size"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeFile('images', index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Primary
                    </span>
                  </div>
                )}
                
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{progress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <VideoCameraIcon className="h-5 w-5 mr-2" />
            Videos
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {safeMedia.videos.length}/5 videos
          </span>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={safeMedia.videos.length >= 5}
            leftIcon={<VideoCameraIcon className="h-4 w-4" />}
          >
            Upload Videos
          </Button>
          <input
            ref={videoInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleFiles(Array.from(e.target.files), 'videos')}
            className="hidden"
          />
        </div>

        {safeMedia.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeMedia.videos.map((video, index) => (
              <div key={video.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {video.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(video.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('videos', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Virtual Tour (for real estate) */}
      {isRealEstate && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <EyeIcon className="h-5 w-5 mr-2" />
            Virtual Tour
          </h3>

          <div className="space-y-3">
            <input
              type="url"
              value={safeMedia.virtualTour}
              onChange={(e) => handleChange('virtualTour', e.target.value)}
              placeholder="https://example.com/virtual-tour"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a link to a 360° virtual tour, Matterport scan, or video walkthrough
            </p>

            {safeMedia.virtualTour && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Virtual tour link added: 
                  <a 
                    href={safeMedia.virtualTour} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:no-underline"
                  >
                    View Tour
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <DocumentIcon className="h-5 w-5 mr-2" />
            Documents
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {safeMedia.documents.length}/10 documents
          </span>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => documentInputRef.current?.click()}
            disabled={safeMedia.documents.length >= 10}
            leftIcon={<DocumentIcon className="h-4 w-4" />}
          >
            Upload Documents
          </Button>
          <input
            ref={documentInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFiles(Array.from(e.target.files), 'documents')}
            className="hidden"
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isRealEstate 
            ? 'Upload property documents, legal papers, floor plans, etc. (PDF, DOC, TXT)'
            : 'Upload product manuals, warranties, certificates, etc. (PDF, DOC, TXT)'
          }
        </p>

        {safeMedia.documents.length > 0 && (
          <div className="space-y-2">
            {safeMedia.documents.map((doc, index) => (
              <div key={doc.id || index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => window.open(doc.url, '_blank')}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile('documents', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          📸 Media Guidelines
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Use high-resolution images (at least 1024x768 pixels)</li>
          <li>• Take photos in good lighting conditions</li>
          <li>• Include multiple angles and close-up shots</li>
          {isRealEstate ? (
            <>
              <li>• Show exterior, interior, and key features</li>
              <li>• Include neighborhood and nearby amenities</li>
              <li>• Virtual tours increase engagement by 40%</li>
            </>
          ) : (
            <>
              <li>• Show the product from different angles</li>
              <li>• Include packaging and accessories if applicable</li>
              <li>• Add videos to demonstrate functionality</li>
            </>
          )}
          <li>• Keep file sizes reasonable for faster loading</li>
        </ul>
      </div>

      {/* Upload Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Media Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Images</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {safeMedia.images.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Videos</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {safeMedia.videos.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Documents</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {safeMedia.documents.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Virtual Tour</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {safeMedia.virtualTour ? '✓' : '✗'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStep;