'use client';

import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Globe, 
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { useGetQuery, usePostQuery, usePatchQuery, useDeleteQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { toast } from '@/components/shared/Toast';
import { CustomAlertModal } from '@/components/shared/CustomAlertModal';

export default function AdminCharitiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: charities, loading, error, getQuery } = useGetQuery();
  const { postQuery: createCharity, loading: creating } = usePostQuery();
  const { patchQuery: updateCharity, loading: updating } = usePatchQuery();
  const { deleteQuery: deleteCharity, loading: deleting } = useDeleteQuery();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    website: '',
    is_featured: false,
  });

  useEffect(() => {
    getQuery({ url: apiUrls.charities.list });
  }, [getQuery]);

  const handleEdit = (charity: any) => {
    setEditingCharity(charity);
    setFormData({
      name: charity.name,
      description: charity.description || '',
      image_url: charity.image_url || '',
      website: charity.website || '',
      is_featured: charity.is_featured || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCharity) {
      await updateCharity({
        url: apiUrls.charities.admin.update(editingCharity.id),
        body: formData,
        onSuccess: () => {
          toast.success('Charity updated!');
          setShowForm(false);
          setEditingCharity(null);
          getQuery({ url: apiUrls.charities.list });
        }
      });
    } else {
      await createCharity({
        url: apiUrls.charities.admin.create,
        body: formData,
        onSuccess: () => {
          toast.success('Charity created!');
          setShowForm(false);
          getQuery({ url: apiUrls.charities.list });
        }
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteCharity({
      url: apiUrls.charities.admin.delete(deleteTarget),
      onSuccess: () => {
        toast.success('Charity deleted.');
        setDeleteTarget(null);
        getQuery({ url: apiUrls.charities.list });
      }
    });
  };

  if (error) return <ErrorState onRetry={() => getQuery({ url: apiUrls.charities.list })} />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Charity Management</h1>
          <p className="text-gray-500 mt-1">Manage partner charities and spotlight organizations.</p>
        </div>
        <CustomButton 
          onClick={() => {
            setEditingCharity(null);
            setFormData({ name: '', description: '', image_url: '', website: '', is_featured: false });
            setShowForm(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Add New Charity
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : (
          charities?.map((charity: any) => (
            <div key={charity.id} className="group bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col">
               <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={charity.image_url || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2076&auto=format&fit=crop'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {charity.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest rounded-full">Featured</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button onClick={() => handleEdit(charity)} className="p-3 rounded-xl bg-white text-black hover:bg-emerald-500 transition-colors">
                        <Edit2 className="w-5 h-5" />
                     </button>
                     <button onClick={() => setDeleteTarget(charity.id)} className="p-3 rounded-xl bg-white text-black hover:bg-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold outfit mb-2">{charity.name}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{charity.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <a href={charity.website} target="_blank" className="text-emerald-500 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Website
                     </a>
                     <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">10,000+ IMPACT</div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Charity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowForm(false)} />
           <div className="w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <h2 className="text-2xl font-black outfit">{editingCharity ? 'Edit Charity' : 'Add New Charity'}</h2>
                 <button onClick={() => setShowForm(false)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Organization Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-emerald-500/50"
                      placeholder="e.g. The Golf Foundation"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-medium focus:outline-none focus:border-emerald-500/50 text-sm"
                      placeholder="Tell the story of the impact..."
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Website URL</label>
                        <input 
                          type="url" 
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-emerald-500/50 text-sm"
                          placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL (Unsplash)</label>
                        <input 
                          type="url" 
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-emerald-500/50 text-sm"
                          placeholder="https://..."
                        />
                    </div>
                 </div>
                 <label className="flex items-center gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_featured ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                       {formData.is_featured && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    <div>
                       <div className="text-sm font-black text-white">Feature this organization</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Show in homepage spotlight and directory header</div>
                    </div>
                 </label>

                 <div className="pt-6 flex justify-end gap-4">
                    <CustomButton variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</CustomButton>
                    <CustomButton loading={creating || updating} type="submit" className="px-12">
                       {editingCharity ? 'Save Changes' : 'Create Charity'}
                    </CustomButton>
                 </div>
              </form>
           </div>
        </div>
      )}

      <CustomAlertModal 
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Charity?"
        message="This action cannot be undone. All associated donation records will be preserved but the charity will be removed from future selection."
        loading={deleting}
      />
    </div>
  );
}
