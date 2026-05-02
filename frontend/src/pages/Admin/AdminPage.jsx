import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { adminApi } from "../../api/services";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  const load = () => adminApi.users().then(({ data }) => setUsers(data.users)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const toggleVerify = async (id) => {
    try {
      await adminApi.verifyUser(id);
      toast.success("Verification updated");
      load();
    } catch {
      toast.error("Unable to update user");
    }
  };

  return (
    <PageWrapper>
      <Header title="Admin Panel" subtitle="Review users, plans, roles, and verification status across the platform." />
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-textMuted">
              <tr>
                <th className="pb-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Plan</th>
                <th className="pb-4">Verified</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-borderTone">
                  <td className="py-4">{user.name}</td>
                  <td className="py-4 text-textMuted">{user.email}</td>
                  <td className="py-4 capitalize">{user.role}</td>
                  <td className="py-4 capitalize">{user.plan}</td>
                  <td className="py-4"><Badge tone={user.isVerified ? "success" : "warning"}>{user.isVerified ? "Verified" : "Pending"}</Badge></td>
                  <td className="py-4"><Button variant="secondary" onClick={() => toggleVerify(user._id)}>Toggle</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
