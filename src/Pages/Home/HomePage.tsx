import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { blogService } from '../../Services/BlogService';
import toast from 'react-hot-toast';
import CustomLoader from '../../Components/CustomLoader';
import Header from '../../Components/Header';
import {
    CalendarDays,
    MessageSquare,
    Heart,
    Eye,
    BookOpen,
    User as UserIcon,
    Mail,
    UserCircle,
    PenTool,
    TrendingUp,
    Grid,
    List,
    Clock,
    ChevronRight,
    Search,
    Filter,
    TrendingUp as TrendingUpIcon,
    Clock as ClockIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { setAllBlogs, setCurrentUser } from '../../redux/features/blogSlice';

type ViewMode = 'grid' | 'list';

export default function HomePage() {
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

    const allBlogs = useSelector((state: RootState) => state.blog.allBlogs);
    const user = useSelector((state: RootState) => state.blog.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getAllBlogs();
        getUserProfile();
    }, []);

    const getAllBlogs = async () => {
        try {
            if (allBlogs.length > 0) {
                return;
            }

            setIsLoader(true);
            const data = await blogService.fetchAllBlogs();
            if (!data.error) {
                // setAllBlogs(data.result);
                dispatch(setAllBlogs(data.result));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error HomePage : ", error);
            toast.error("Something went wrong !!");
        }
        setIsLoader(false);
    }

    const getUserProfile = async () => {
        try {
            if (user) {
                return;
            }
            const data = await blogService.fetchUserProfile();
            if (!data.error) {
                // setUserProfile(data.result);
                dispatch(setCurrentUser(data.result));
            }
        } catch (err) {
            console.error("Fetch User Profile : ", err);
        }
    }

    if (isLoader) {
        return <CustomLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                StorySphere
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover, read, and share amazing stories from our vibrant community of writers
                        </p>
                    </div>


                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* User Profile Sidebar */}
                    {user && (
                        <div className="lg:w-1/3">
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                                            <div className="w-full h-full bg-white rounded-full p-1">
                                                {user.profile_image ? (
                                                    <img
                                                        src={user.profile_image}
                                                        alt={user.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                                        <UserCircle className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        Member
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        {user.gender && (
                                            <div className="flex items-center text-gray-600">
                                                <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                <span className="capitalize">{user.gender}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user.about && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <PenTool className="w-4 h-4 mr-2" />
                                            About Me
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {user.about}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate('/profile')}
                                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Blog Content Area */}
                    <div className="lg:w-2/3">
                        {/* Controls Bar */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Latest Stories <span className="text-gray-400">({allBlogs.length})</span>
                                </h2>

                                <div className="flex items-center gap-4">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search stories..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                        />
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                        >
                                            <option value="latest">Latest</option>
                                            <option value="popular">Popular</option>
                                        </select>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <Grid className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={blog.thumbnail}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded">
                                                    {blog.category}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-3 left-3">
                                                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {blog.create_at}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {blog.subtitle}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <Heart className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm">{blog.likes}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm">{blog.comment.length}</span>
                                                    </div>
                                                </div>

                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                                    Read
                                                    <Eye className="w-4 h-4 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-6">
                                {allBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                    >
                                        <div className="md:flex">
                                            {/* Thumbnail */}
                                            <div className="md:w-1/3 relative">
                                                <img
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="md:w-2/3 p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                                        {blog.category}
                                                    </span>
                                                    <div className="flex items-center text-gray-400 text-sm">
                                                        <ClockIcon className="w-4 h-4 mr-1" />
                                                        {blog.create_at}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {blog.subtitle}
                                                </p>

                                                {/* Stats and Action */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center space-x-6 text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <Heart className="w-4 h-4 text-red-500" />
                                                            <span className="text-sm font-medium">{blog.likes} likes</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <MessageSquare className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm font-medium">{blog.comment.length} comments</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Eye className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium"> 0 views</span>
                                                        </div>
                                                    </div>

                                                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                                                        Read Article
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Featured Blog Card (Visible in Grid view only) */}
                        {viewMode === 'grid' && allBlogs.length > 0 && (
                            <div className="mt-8">
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="md:flex">
                                        <div className="md:w-2/5 relative">
                                            <img
                                                src={allBlogs[0].thumbnail}
                                                alt={allBlogs[0].title}
                                                className="w-full h-64 md:h-full object-cover"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                    <TrendingUpIcon className="w-3 h-3" />
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 p-8">
                                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-sm rounded-full mb-4">
                                                {allBlogs[0].category}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                {allBlogs[0].title}
                                            </h3>
                                            <p className="text-gray-300 mb-4 line-clamp-2">
                                                {allBlogs[0].subtitle}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-300 text-sm">
                                                    <CalendarDays className="w-4 h-4 mr-1" />
                                                    {allBlogs[0].create_at}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/blog/${allBlogs[0]._id}`)}
                                                    className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Read Full Story
                                                    <Eye className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {allBlogs.length === 0 && !isLoader && (
                            <div className="text-center py-16">
                                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {searchQuery ? 'No results found' : 'No stories yet'}
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    {searchQuery
                                        ? `No stories found for "${searchQuery}". Try a different search.`
                                        : 'Be the first to share your amazing story with our community!'
                                    }
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => navigate('/create')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        <PenTool className="w-5 h-5 mr-2" />
                                        Create Your First Story
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 pt-8 pb-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} StorySphere. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Contact Us</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}