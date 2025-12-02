import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { blogService } from '../../Services/BlogService';
import toast from 'react-hot-toast';
import Header from '../../Components/Header';
import type { AddBlog, Blog } from '../../Types/types';
import {
    Upload,
    Image as ImageIcon,
    Tag,
    BookOpen,
    User,
    Type,
    FileText,
    Hash,
    X,
    ChevronDown,
    Save,
    ArrowLeft,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Eye
} from 'lucide-react';

const CATEGORIES = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Entertainment',
    'Sports',
    'Education',
    'Science',
    'Art',
    'Music',
    'Fashion',
    'Finance',
    'Personal Development'
];

export default function AddBlogPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [previewMode, setPreviewMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<AddBlog>>({
        title: '',
        subtitle: '',
        content: '',
        author: '',
        category: '',
        tags: [],
        thumbnail: ''
    });
    const [tagInput, setTagInput] = useState<string>('');
    const [showCategories, setShowCategories] = useState<boolean>(false);

    // Fetch user data for author field
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const data = await blogService.fetchUserProfile();
            if (!data.error && data.result) {
                setFormData(prev => ({
                    ...prev,
                    author: data.result.name || data.result.email.split('@')[0]
                }));
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!formData.tags?.includes(newTag) && formData.tags && formData.tags.length < 10) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag]
                }));
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            try {
                setIsLoading(true);
                // In a real application, you would upload to a server
                // For now, we'll create a local URL
                const imageUrl = URL.createObjectURL(file);
                setFormData(prev => ({
                    ...prev,
                    thumbnail: imageUrl
                }));
                toast.success('Image uploaded successfully!');
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleContentFormat = (format: 'bold' | 'italic' | 'list' | 'link') => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        let newText = '';

        switch (format) {
            case 'bold':
                newText = `**${selectedText}**`;
                break;
            case 'italic':
                newText = `*${selectedText}*`;
                break;
            case 'list':
                newText = `\n- ${selectedText}`;
                break;
            case 'link':
                newText = `[${selectedText}](https://example.com)`;
                break;
        }

        const updatedContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
        setFormData(prev => ({
            ...prev,
            content: updatedContent
        }));

        // Focus back on textarea and set cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + newText.length, start + newText.length);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title?.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.content?.trim()) {
            toast.error('Content is required');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }
        if (!formData.thumbnail) {
            toast.error('Please upload a thumbnail image');
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare blog data
            const blogData = {
                ...formData,
                status: 'published',
                publishedAt: new Date().toISOString(),
                likes: 0,
                comment: [],
                views: 0
            };

            // In a real application, you would send this to your API
            // const response = await blogService.createBlog(blogData);

            // if (!response.error) {
            //     toast.success('Blog published successfully!');
            //     navigate('/');
            // } else {
            //     toast.error(response.message || 'Failed to publish blog');
            // }
        } catch (error) {
            console.error('Error creating blog:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPreview = () => (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-24 rounded-full" />
            </div>

            {/* Thumbnail */}
            {formData.thumbnail && (
                <div className="mb-6">
                    <img
                        src={formData.thumbnail}
                        alt="Blog thumbnail"
                        className="w-full h-64 object-cover rounded-xl shadow-md"
                    />
                </div>
            )}

            {/* Category */}
            {formData.category && (
                <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                    {formData.category}
                </span>
            )}

            {/* Title */}
            {formData.title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {formData.title}
                </h1>
            )}

            {/* Subtitle */}
            {formData.subtitle && (
                <p className="text-lg text-gray-600 mb-6">
                    {formData.subtitle}
                </p>
            )}

            {/* Author & Date */}
            <div className="flex items-center gap-4 mb-8 text-gray-500">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{formData.author || 'Anonymous'}</span>
                </div>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}</span>
            </div>

            {/* Content */}
            {formData.content && (
                <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                        {formData.content}
                    </p>
                </div>
            )}

            {/* Tags */}
            {formData.tags && formData.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Create New Story
                    </h1>
                    <p className="text-gray-600">
                        Share your thoughts, ideas, and experiences with the world
                    </p>
                </div>

                {/* Toggle Preview */}
                <div className="flex items-center justify-between mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                            Writing a new blog post
                        </span>
                    </div>

                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {previewMode ? 'Edit Mode' : 'Preview Mode'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    {!previewMode ? (
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                                    {/* Title */}
                                    <div className="mb-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Type className="w-4 h-4 mr-2" />
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter a captivating title for your story"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                            maxLength={120}
                                        />
                                        <div className="text-right text-xs text-gray-500 mt-1">
                                            {formData.title?.length || 0}/120 characters
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <div className="mb-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Subtitle (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            value={formData.subtitle}
                                            onChange={handleInputChange}
                                            placeholder="A brief summary of your story"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={200}
                                        />
                                        <div className="text-right text-xs text-gray-500 mt-1">
                                            {formData.subtitle?.length || 0}/200 characters
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Hash className="w-4 h-4 mr-2" />
                                            Category
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowCategories(!showCategories)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-white"
                                            >
                                                <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                                                    {formData.category || 'Select a category'}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showCategories && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setShowCategories(false)}
                                                    />
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {CATEGORIES.map(category => (
                                                            <button
                                                                key={category}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, category }));
                                                                    setShowCategories(false);
                                                                }}
                                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <span className="text-gray-700">{category}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="mb-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Tag className="w-4 h-4 mr-2" />
                                            Tags
                                            <span className="ml-2 text-xs text-gray-500">
                                                (Press Enter to add, max 10 tags)
                                            </span>
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.tags?.map(tag => (
                                                <div
                                                    key={tag}
                                                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="text-blue-400 hover:text-blue-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Type a tag and press Enter"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Author */}
                                    <div className="mb-6">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 mr-2" />
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Your name or pen name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Thumbnail Upload */}
                                    <div className="mb-8">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Thumbnail Image
                                        </label>

                                        {formData.thumbnail ? (
                                            <div className="relative mb-4">
                                                <img
                                                    src={formData.thumbnail}
                                                    alt="Thumbnail preview"
                                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="block">
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                                        <span className="text-gray-700 font-medium mb-1">
                                                            Upload Thumbnail
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            PNG, JPG or GIF (max 5MB)
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </label>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="flex items-center text-sm font-medium text-gray-700">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Content
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleContentFormat('bold')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                    title="Bold"
                                                >
                                                    <Bold className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleContentFormat('italic')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                    title="Italic"
                                                >
                                                    <Italic className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleContentFormat('list')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                    title="List"
                                                >
                                                    <List className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleContentFormat('link')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                    title="Link"
                                                >
                                                    <LinkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            id="content"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="Start writing your amazing story here..."
                                            rows={12}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                                        />
                                        <div className="text-right text-xs text-gray-500 mt-1">
                                            {formData.content?.length || 0} characters
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isLoading}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Publish Story
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* Right Column - Preview */
                        <div className="lg:col-span-2">
                            {renderPreview()}
                        </div>
                    )}

                    {/* Right Column - Guidelines */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Writing Guidelines
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Type className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Title Tips</h4>
                                        <p className="text-sm text-gray-600">
                                            Keep it under 120 characters. Make it compelling and clear.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <ImageIcon className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Image Requirements</h4>
                                        <p className="text-sm text-gray-600">
                                            Use high-quality images. PNG, JPG, or GIF under 5MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Tag className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Tag Suggestions</h4>
                                        <p className="text-sm text-gray-600">
                                            Add relevant tags to help readers find your content.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <BookOpen className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Content Quality</h4>
                                        <p className="text-sm text-gray-600">
                                            Write valuable, well-structured content. Proofread before publishing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Quick Formatting</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                            **bold**
                                        </code>
                                        <span className="text-gray-600">for bold text</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                            *italic*
                                        </code>
                                        <span className="text-gray-600">for italic text</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                            - item
                                        </code>
                                        <span className="text-gray-600">for bullet points</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setPreviewMode(!previewMode)}
                                className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-medium rounded-lg hover:shadow transition-all duration-300"
                            >
                                {previewMode ? 'Back to Editing' : 'Preview Your Story'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 pt-8 pb-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} StorySphere. Share your story with the world.
                    </p>
                </div>
            </footer>
        </div>
    );
}