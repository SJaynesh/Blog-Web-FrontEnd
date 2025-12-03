import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router'
import { blogService } from '../../Services/BlogService';
import type { Blog } from '../../Types/types';
import {
    CalendarDays,
    UserCircle,
    Tag,
    MessageCircle,
    Clock,
    BookOpen,
    Share2,
    Bookmark,
    ThumbsUp,
    Eye,
    TrendingUp,
    ChevronRight,
    Send,
    MoreVertical,
    Heart,
    BookmarkPlus,
    ArrowUpRight,
    CheckCircle
} from 'lucide-react';

export default function BlogDetailPage() {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'comments' | 'related'>('comments');
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const param = useParams();

    useEffect(() => {
        getBlog();
    }, []);

    const getBlog = async () => {
        try {
            setLoading(true);
            const data = await blogService.fetchSinglBlog(param.blogId || "");

            if (!data.error) {
                setBlog(data.result);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Fetch Single Blog: ", err);
            toast.error("Something went wrong !!");
        } finally {
            setLoading(false);
        }
    }

    const handleLike = () => {
        setLiked(!liked);
        // API call for like
    }

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        // API call for bookmark
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title,
                    text: blog?.subtitle,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    }

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        // API call to submit comment
        console.log('Submitting comment:', comment);
        setComment('');
        toast.success('Comment posted successfully!');
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="animate-pulse space-y-8 w-full max-w-6xl">
                    <div className="h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl"></div>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Blog Not Found</h2>
                    <p className="text-gray-500 text-lg">The article you're looking for has been moved or doesn't exist.</p>
                    <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        Browse Articles <ArrowUpRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <span className="hover:text-blue-600 cursor-pointer">Home</span>
                        <ChevronRight size={14} />
                        <span className="hover:text-blue-600 cursor-pointer">Blog</span>
                        <ChevronRight size={14} />
                        <span className="hover:text-blue-600 cursor-pointer">{blog.category}</span>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium truncate max-w-xs">{blog.title}</span>
                    </div>

                    {/* Blog Header */}
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium">
                                {blog.category}
                            </span>
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays size={16} />
                                    {blog.create_at.split(',')[0]}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    {blog.create_at.split(',')[1]}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye size={16} />
                                    1.2k views
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                            {blog.title}
                        </h1>

                        <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
                            {blog.subtitle}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center justify-center gap-6 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={blog.author.profile_image}
                                        alt={blog.author.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                        <CheckCircle size={16} className="text-white" />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900 text-lg">{blog.author.name}</h3>
                                    <p className="text-gray-500">Senior Writer • 8 min read</p>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-gray-200"></div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <Heart size={20} className={liked ? 'fill-red-600' : ''} />
                                    <span className="font-semibold">{blog.likes} Likes</span>
                                </button>
                                <button
                                    onClick={handleBookmark}
                                    className={`p-2.5 rounded-xl transition-all ${bookmarked ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <BookmarkPlus size={20} className={bookmarked ? 'fill-blue-600' : ''} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-[500px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white/80 text-sm">
                            Featured image • Photo by {blog.author.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Stats Bar */}
                <div className="flex items-center justify-between mb-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{blog.likes}</div>
                            <div className="text-sm text-gray-600">Likes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{blog.comment.length}</div>
                            <div className="text-sm text-gray-600">Comments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">1.2k</div>
                            <div className="text-sm text-gray-600">Views</div>
                        </div>
                    </div>
                    <TrendingUp className="text-blue-600" size={24} />
                </div>

                {/* Blog Content */}
                <article className="prose prose-lg max-w-none mb-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <div
                            className="text-gray-800 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </article>

                {/* Tags Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Tag size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Explore Related Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {blog.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all cursor-pointer border border-gray-200 hover:border-blue-200 font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Interaction Tabs */}
                <div className="mb-12">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`flex items-center gap-3 px-6 py-4 text-lg font-medium border-b-2 transition-all ${activeTab === 'comments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <MessageCircle size={22} />
                            Comments ({blog.comment.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('related')}
                            className={`flex items-center gap-3 px-6 py-4 text-lg font-medium border-b-2 transition-all ${activeTab === 'related' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <BookOpen size={22} />
                            Related Articles
                        </button>
                    </div>

                    {/* Comments Tab Content */}
                    {activeTab === 'comments' && (
                        <div className="pt-8">
                            {/* Add Comment Form */}
                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 mb-10 border border-blue-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Join the conversation</h3>
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                                <UserCircle size={28} className="text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full h-32 p-5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400"
                                                placeholder="What are your thoughts on this article? Share your insights..."
                                            />
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-sm text-gray-500">
                                                    {comment.length}/500 characters
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!comment.trim()}
                                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <Send size={18} />
                                                    Post Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xl font-bold text-gray-900">
                                        All Comments ({blog.comment.length})
                                    </h4>
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                                        <option>Sort by: Newest</option>
                                        <option>Sort by: Most Liked</option>
                                    </select>
                                </div>

                                {blog.comment.length > 0 ? (
                                    blog.comment.map((com, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            src={com.userId.profile_image}
                                                            alt={com.userId.name}
                                                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                                        />
                                                        {index === 0 && (
                                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.117c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="font-bold text-gray-900">{com.userId.name}</h5>
                                                                {index === 0 && (
                                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                        Author
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                {com.create_at}
                                                            </span>
                                                        </div>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                            <MoreVertical size={18} className="text-gray-400" />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed mb-4">
                                                        {com.msg}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                                                            <ThumbsUp size={18} />
                                                            <span className="text-sm">12</span>
                                                        </button>
                                                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
                                                            <Heart size={18} />
                                                            <span className="text-sm">5</span>
                                                        </button>
                                                        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <MessageCircle size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No comments yet</h3>
                                        <p className="text-gray-500 text-lg mb-8">Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Related Articles Tab Content */}
                    {activeTab === 'related' && (
                        <div className="pt-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div
                                        key={item}
                                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-gray-200"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 rounded-full text-sm font-medium">
                                                    Related
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <Clock size={14} />
                                                8 min read
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                How to master {blog.category} in 2024
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                                    <span className="text-sm text-gray-600">John Doe</span>
                                                </div>
                                                <ArrowUpRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}